import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InventarItem } from './inventar-item.schema';
import { User } from 'src/user/schemas/user.schema';

export type InventarItemEventDocument = HydratedDocument<InventarItemEvent>;

export type InventarItemEventType = 'borrowed' | 'returned';

@Schema()
export class InventarItemEvent {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: InventarItem.name,
  })
  inventarItem: InventarItem;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true })
  type: InventarItemEventType;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const InventarItemEventSchema =
  SchemaFactory.createForClass(InventarItemEvent);
