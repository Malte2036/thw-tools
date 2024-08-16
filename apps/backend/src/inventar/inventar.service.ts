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
    return this.inventarItemModel.find().exec();
  }

  async getInventarItemByDeviceId(deviceId: InventarDeviceId) {
    return this.inventarItemModel.findOne({ deviceId }).exec();
  }

  async createInventarItem(deviceId: InventarDeviceId, isUsed = false) {
    if (await this.getInventarItemByDeviceId(deviceId)) {
      Logger.warn(`Inventar item with deviceId ${deviceId} already exists`);
      return;
    }

    const item = new this.inventarItemModel({ deviceId, isUsed });
    return item.save();
  }

  async updateInventarItem(deviceId: InventarDeviceId, isUsed: boolean) {
    return this.inventarItemModel.updateOne({ deviceId }, { isUsed });
  }
}
