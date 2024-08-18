import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InventarDeviceId, InventarItem } from './schemas/inventar-item.schema';
import { Model } from 'mongoose';

@Injectable()
export class InventarService {
  constructor(
    @InjectModel(InventarItem.name)
    private inventarItemModel: Model<InventarItem>,
  ) {}

  async getInventarItems() {
    return this.inventarItemModel.find().populate('lastUsedBy').exec();
  }

  async getInventarItemByDeviceId(deviceId: InventarDeviceId) {
    return this.inventarItemModel
      .findOne({ deviceId })
      .populate('lastUsedBy')
      .exec();
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

  async updateInventarItem(
    deviceId: InventarDeviceId,
    data: Partial<InventarItem>,
  ) {
    return this.inventarItemModel.updateOne({ deviceId }, data).exec();
  }
}
