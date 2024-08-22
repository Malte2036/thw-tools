import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OrganisationDocument } from 'src/organisation/schemas/organisation.schema';
import { UserDocument } from 'src/user/schemas/user.schema';
import { InventarItemEventBulk } from './schemas/inventar-item-event-bulk.schema';
import {
  InventarItemEvent,
  InventarItemEventDocument,
  InventarItemEventType,
} from './schemas/inventar-item-event.schema';
import {
  InventarDeviceId,
  InventarItem,
  InventarItemDocument,
} from './schemas/inventar-item.schema';

@Injectable()
export class InventarService {
  constructor(
    @InjectModel(InventarItem.name)
    private inventarItemModel: Model<InventarItem>,
    @InjectModel(InventarItemEvent.name)
    private inventarItemEventModel: Model<InventarItemEvent>,
    @InjectModel(InventarItemEventBulk.name)
    private inventarItemEventBulkModel: Model<InventarItemEventBulk>,
  ) {}

  async getInventarItems(organisationId: mongoose.Types.ObjectId) {
    return this.inventarItemModel
      .find({
        organisation: organisationId,
      })
      .exec();
  }

  async getExpandedInventarItems(organisationId: mongoose.Types.ObjectId) {
    const inventarItems = await this.getInventarItems(organisationId);
    return Promise.all(
      inventarItems.map(async (item) => {
        const lastEvent = await this.getLastEventForItem(item);

        return {
          ...item.toObject(),
          lastEvent,
        };
      }),
    );
  }

  async getInventarItemByDeviceId(
    organisationId: mongoose.Types.ObjectId,
    deviceId: InventarDeviceId,
  ) {
    return (
      this.inventarItemModel
        .findOne({
          organisation: organisationId,
          deviceId,
        })
        // .populate('lastUsedBy')
        .exec()
    );
  }

  async createInventarItem(
    organisationId: mongoose.Types.ObjectId,
    data: InventarItem,
  ) {
    if (await this.getInventarItemByDeviceId(organisationId, data.deviceId)) {
      Logger.warn(
        `Inventar item with deviceId ${data.deviceId} already exists`,
      );
      return;
    }

    const item = new this.inventarItemModel(data);
    return item.save();
  }

  async createInventarItemEvent(data: InventarItemEvent) {
    const event = new this.inventarItemEventModel(data);
    return event.save();
  }

  async getInventarItemEvents(itemDoc: InventarItemDocument) {
    return this.inventarItemEventModel
      .find({ inventarItem: itemDoc._id })
      .populate('user')
      .exec();
  }

  async getLastEventForItem(
    itemDoc: InventarItemDocument,
  ): Promise<InventarItemEventDocument | null> {
    return this.inventarItemEventModel
      .findOne({ inventarItem: itemDoc._id })
      .sort({ date: -1 })
      .populate('user')
      .exec();
  }

  async bulkCreateInventarItemEvents(
    data: { deviceId: string; eventType: InventarItemEventType }[],
    user: UserDocument,
    organisation: OrganisationDocument,
    date: Date,
  ): Promise<void> {
    const items = await Promise.all(
      data.map(async ({ deviceId }) => {
        let item = await this.getInventarItemByDeviceId(
          organisation._id,
          deviceId,
        );
        if (!item) {
          Logger.log(
            `Creating inventar item with deviceId ${deviceId}, as it does not exist`,
          );
          item = await this.createInventarItem(organisation._id, {
            deviceId,
            organisation,
          });
        }

        return item;
      }),
    );

    const events = await Promise.all(
      items.map((item, index) =>
        this.createInventarItemEvent({
          date,
          inventarItem: item,
          user,
          type: data[index].eventType,
        }),
      ),
    );

    const bulk = new this.inventarItemEventBulkModel({
      inventarItemEvents: events,
      user,
      organisation,
      date,
    });
    await bulk.save();
  }
}
