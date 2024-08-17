import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type InventarItemDocument = HydratedDocument<InventarItem>;

export type InventarDeviceId = string;

@Schema()
export class InventarItem {
  @Prop({ required: true })
  deviceId: InventarDeviceId;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ required: false, type: mongoose.Types.ObjectId, ref: User.name })
  lastUsedBy: User;
}

export const InventarItemSchema = SchemaFactory.createForClass(InventarItem);
