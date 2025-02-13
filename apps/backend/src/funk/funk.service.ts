import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Organisation } from '../organisation/entities/organisation.entity';
import { FunkItem } from './entities/funk-item.entity';
import {
  FunkItemEvent,
  FunkItemEventType,
} from './entities/funk-item-event.entity';
import { FunkItemEventBulk } from './entities/funk-item-event-bulk.entity';

// MongoDB-style response type
type MongoDBStyleFunkItemEventBulk = {
  id: string;
  funkItemEvents: {
    id: string;
    funkItem: string;
    user: string;
    type: string;
    date: Date;
  }[];
  eventType: string;
  batteryCount: number;
  user: string;
  organisation: string;
  date: Date;
};

@Injectable()
export class FunkService {
  constructor(
    @InjectRepository(FunkItem)
    private readonly funkItemRepository: Repository<FunkItem>,
    @InjectRepository(FunkItemEvent)
    private readonly funkItemEventRepository: Repository<FunkItemEvent>,
    @InjectRepository(FunkItemEventBulk)
    private readonly funkItemEventBulkRepository: Repository<FunkItemEventBulk>,
  ) {}

  async getFunkItems(organisationId: string) {
    return this.funkItemRepository.find({
      where: { organisation: { id: organisationId } },
      relations: ['organisation'],
      select: {
        organisation: {
          id: true,
        },
      },
    });
  }

  async getExpandedFunkItems(organisationId: string) {
    const funkItems = await this.funkItemRepository.find({
      where: { organisation: { id: organisationId } },
      relations: ['organisation'],
    });

    // Get the latest event for each funk item
    const lastEvents = await Promise.all(
      funkItems.map(async (item) => {
        const lastEvent = await this.funkItemEventRepository.findOne({
          where: { funkItem: { id: item.id } },
          order: { date: 'DESC' },
          relations: ['funkItem'],
        });
        return { itemId: item.id, lastEvent };
      }),
    );

    // Create a map of item ID to last event
    const lastEventMap = new Map(
      lastEvents.map(({ itemId, lastEvent }) => [itemId, lastEvent]),
    );

    return funkItems.map((item) => ({
      ...item,
      lastEvent: lastEventMap.get(item.id) || null,
    }));
  }

  async getFunkItemByDeviceId(organisationId: string, deviceId: string) {
    return this.funkItemRepository.findOne({
      where: {
        organisation: { id: organisationId },
        deviceId,
      },
      relations: ['organisation'],
      select: {
        organisation: {
          id: true,
        },
      },
    });
  }

  async createFunkItem(organisationId: string, data: Partial<FunkItem>) {
    const existingItem = await this.getFunkItemByDeviceId(
      organisationId,
      data.deviceId,
    );
    if (existingItem) {
      Logger.warn(`Funk item with deviceId ${data.deviceId} already exists`);
      return existingItem;
    }

    const item = this.funkItemRepository.create(data);
    return this.funkItemRepository.save(item);
  }

  async createFunkItemEvent(data: Partial<FunkItemEvent>) {
    const event = this.funkItemEventRepository.create(data);
    return this.funkItemEventRepository.save(event);
  }

  async getFunkItemEvents(item: FunkItem) {
    return this.funkItemEventRepository.find({
      where: { funkItem: { id: item.id } },
      relations: ['user', 'funkItem'],
      select: {
        id: true,
        type: true,
        date: true,
        user: {
          id: true,
        },
        funkItem: {
          id: true,
        },
      },
      order: { date: 'DESC' },
    });
  }

  async bulkCreateFunkItemEvents(
    data: {
      deviceIds: string[];
      batteryCount: number;
      eventType: FunkItemEventType;
    },
    user: User,
    organisation: Organisation,
    date: Date,
  ): Promise<void> {
    const items = await Promise.all(
      data.deviceIds.map(async (deviceId) => {
        let item = await this.getFunkItemByDeviceId(organisation.id, deviceId);
        if (!item) {
          Logger.log(
            `Creating Funk item with deviceId ${deviceId}, as it does not exist`,
          );
          item = await this.createFunkItem(organisation.id, {
            deviceId,
            organisation,
          });
        }
        return item;
      }),
    );

    const events = await Promise.all(
      items.map((item) =>
        this.createFunkItemEvent({
          date,
          funkItem: item,
          user,
          type: data.eventType,
        }),
      ),
    );

    const bulk = this.funkItemEventBulkRepository.create({
      funkItemEvents: events,
      batteryCount: data.batteryCount,
      eventType: data.eventType,
      user,
      organisation,
      date,
    });
    await this.funkItemEventBulkRepository.save(bulk);
  }

  async getFunkItemEventBulks(organisationId: string) {
    return this.funkItemEventBulkRepository
      .createQueryBuilder('bulk')
      .leftJoinAndSelect('bulk.funkItemEvents', 'events')
      .leftJoin('events.funkItem', 'funkItem')
      .leftJoin('bulk.user', 'bulkUser')
      .leftJoin('bulk.organisation', 'org')
      .leftJoin('events.user', 'eventUser')
      .select([
        'bulk.id',
        'bulk.eventType',
        'bulk.batteryCount',
        'bulk.date',
        'bulkUser.id',
        'org.id',
        'events.id',
        'events.type',
        'events.date',
        'eventUser.id',
        'funkItem.id',
      ])
      .where('org.id = :organisationId', { organisationId })
      .orderBy('bulk.date', 'DESC')
      .getMany();
  }

  async exportFunkItemEventBulksAsCsv(organisationId: string): Promise<string> {
    // Get the full user data for CSV export
    const bulks = await this.funkItemEventBulkRepository
      .createQueryBuilder('bulk')
      .leftJoinAndSelect('bulk.funkItemEvents', 'events')
      .leftJoinAndSelect('events.funkItem', 'funkItem')
      .leftJoinAndSelect('bulk.user', 'bulkUser')
      .leftJoinAndSelect('bulk.organisation', 'org')
      .where('org.id = :organisationId', { organisationId })
      .orderBy('bulk.date', 'DESC')
      .getMany();

    let csv = 'date,eventType,batteryCount,user,deviceIds\n';

    for (const bulk of bulks) {
      csv += `${bulk.date.toISOString()},${bulk.eventType},${
        bulk.batteryCount
      },"${bulk.user.firstName} ${bulk.user.lastName} (${
        bulk.user.email
      })","${bulk.funkItemEvents
        .map((event) => event.funkItem.deviceId)
        .join(', ')}"\n`;
    }

    return csv;
  }

  async importFunkItemsFromCsv(
    csvContent: string,
    organisation: Organisation,
    user: User,
  ): Promise<void> {
    const lines = csvContent.split('\n');
    // Skip header row and empty lines
    const dataLines = lines.slice(1).filter((line) => line.trim());

    for (const line of dataLines) {
      const [dateStr, eventType, batteryCountStr, , deviceIdsStr] = line
        .split(',')
        .map((field) => field.trim().replace(/^"|"$/g, '')); // Remove quotes

      // Skip invalid lines
      if (!dateStr || !eventType || !deviceIdsStr) {
        Logger.warn(`Skipping invalid CSV line: ${line}`);
        continue;
      }

      const deviceIds = deviceIdsStr.split(',').map((id) => id.trim());
      const date = new Date(dateStr);
      const batteryCount = parseInt(batteryCountStr) || 0;

      // Create funk items and events
      await this.bulkCreateFunkItemEvents(
        {
          deviceIds,
          batteryCount,
          eventType: eventType as FunkItemEventType,
        },
        user,
        organisation,
        date,
      );
    }
  }
}
