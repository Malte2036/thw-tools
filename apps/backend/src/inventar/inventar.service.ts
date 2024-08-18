import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  InventarDeviceId,
  InventarItem,
  InventarItemDocument,
} from './schemas/inventar-item.schema';
import { Model } from 'mongoose';
import {
  InventarItemEvent,
  InventarItemEventDocument,
} from './schemas/inventar-item-event.schema';

@Injectable()
export class InventarService {
  constructor(
    @InjectModel(InventarItem.name)
    private inventarItemModel: Model<InventarItem>,
    @InjectModel(InventarItemEvent.name)
    private inventarItemEventModel: Model<InventarItemEvent>,
  ) {}

  async getInventarItems() {
    return (
      this.inventarItemModel
        .find()
        // .populate('lastUsedBy')
        .exec()
    );
  }

  async getExpandedInventarItems() {
    const inventarItems = await this.getInventarItems();
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
  async getLastEventForItem(
    itemDoc: InventarItemDocument,
  ): Promise<InventarItemEventDocument | null> {
    return this.inventarItemEventModel
      .findOne({ inventarItem: itemDoc._id })
      .sort({ date: -1 })
      .populate('user')
      .exec();
  }

  async getInventarItemByDeviceId(deviceId: InventarDeviceId) {
    return (
      this.inventarItemModel
        .findOne({ deviceId })
        // .populate('lastUsedBy')
        .exec()
    );
  }

  async createInventarItem(data: InventarItem) {
    if (await this.getInventarItemByDeviceId(data.deviceId)) {
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
}
