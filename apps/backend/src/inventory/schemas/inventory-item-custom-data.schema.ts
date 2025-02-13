import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InventoryItem } from './inventory-item.schema';

export type InventoryItemCustomDataDocument =
  HydratedDocument<InventoryItemCustomData>;

@Schema()
export class InventoryItemCustomData {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: InventoryItem.name,
    unique: true,
  })
  inventoryItem: InventoryItem;

  @Prop({ type: Date, required: false })
  lastScanned: Date;

  @Prop({ required: false })
  note: string;
}

export const InventoryItemCustomDataSchema = SchemaFactory.createForClass(
  InventoryItemCustomData,
);
