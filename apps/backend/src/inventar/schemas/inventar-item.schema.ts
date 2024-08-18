import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Organisation } from 'src/organisation/schemas/organisation.schema';

export type InventarItemDocument = HydratedDocument<InventarItem>;

export type InventarDeviceId = string;

@Schema()
export class InventarItem {
  @Prop({ required: true })
  deviceId: InventarDeviceId;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Organisation.name,
  })
  organisation: Organisation;
}

export const InventarItemSchema = SchemaFactory.createForClass(InventarItem);
