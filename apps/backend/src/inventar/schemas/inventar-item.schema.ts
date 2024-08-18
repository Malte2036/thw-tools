import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InventarItemDocument = HydratedDocument<InventarItem>;

export type InventarDeviceId = string;

@Schema()
export class InventarItem {
  @Prop({ required: true })
  deviceId: InventarDeviceId;
}

export const InventarItemSchema = SchemaFactory.createForClass(InventarItem);
