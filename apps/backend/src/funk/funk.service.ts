import { Injectable, Logger } from '@nestjs/common';
import type {
  FunkItem,
  FunkItemEventType,
  Organisation,
  Prisma,
  User,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FunkService {
  private readonly logger = new Logger(FunkService.name);

  constructor(private prisma: PrismaService) {}

  async getFunkItems(organisationId: string) {
    return this.prisma.funkItem.findMany({
      where: { organisationId },
    });
  }

  async getFunkItemByDeviceId(organisationId: string, deviceId: string) {
    return this.prisma.funkItem.findFirst({
      where: {
        organisationId,
        deviceId,
      },
    });
  }

  async createFunkItem(
    organisationId: string,
    data: Prisma.FunkItemCreateInput,
  ) {
    const existingItem = await this.getFunkItemByDeviceId(
      organisationId,
      data.deviceId,
    );
    if (existingItem) {
      this.logger.warn(
        `Funk item with deviceId ${data.deviceId} already exists`,
      );
      return existingItem;
    }

    return this.prisma.funkItem.create({
      data: {
        deviceId: data.deviceId,
        organisationId,
      },
    });
  }

  async createFunkItemEvent(data: Prisma.FunkItemEventCreateInput) {
    return this.prisma.funkItemEvent.create({
      data,
    });
  }

  async getFunkItemEvents(item: FunkItem) {
    return this.prisma.funkItemEvent.findMany({
      where: { funkItemId: item.id },
      orderBy: { date: 'desc' },
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
          this.logger.log(
            `Creating Funk item with deviceId ${deviceId}, as it does not exist`,
          );
          item = await this.createFunkItem(organisation.id, {
            deviceId,
            organisation: {
              connect: {
                id: organisation.id,
              },
            },
          });
        }
        return item;
      }),
    );

    const events = await Promise.all(
      items.map((item) =>
        this.createFunkItemEvent({
          date,
          funkItem: {
            connect: {
              id: item.id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          type: data.eventType,
        }),
      ),
    );

    await this.prisma.funkItemEventBulk.create({
      data: {
        eventType: data.eventType,
        batteryCount: data.batteryCount,
        userId: user.id,
        organisationId: organisation.id,
        date,
        events: {
          create: events.map((event) => ({
            eventId: event.id,
          })),
        },
      },
    });
  }

  async getFunkItemEventBulks(organisationId: string) {
    return this.prisma.funkItemEventBulk.findMany({
      where: { organisationId },
      include: {
        events: {
          include: {
            event: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async exportFunkItemEventBulksAsCsv(organisationId: string): Promise<string> {
    const bulks = await this.prisma.funkItemEventBulk.findMany({
      where: { organisationId },
      include: {
        events: {
          include: {
            event: {
              include: {
                funkItem: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    let csv = 'date,eventType,batteryCount,user,deviceIds\n';

    for (const bulk of bulks) {
      csv += `${bulk.date.toISOString()},${bulk.eventType},${
        bulk.batteryCount
      },"${bulk.user.firstName} ${bulk.user.lastName} (${
        bulk.user.email
      })","${bulk.events
        .map((bulkEvent) => bulkEvent.event.funkItem.deviceId)
        .join(', ')}"\n`;
    }

    return csv;
  }
}
