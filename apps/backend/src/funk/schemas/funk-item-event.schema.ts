import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FunkItem } from './funlk-item.schema';
import { User } from 'src/user/schemas/user.schema';

export type FunkItemEventDocument = HydratedDocument<FunkItemEvent>;

export type FunkItemEventType = 'borrowed' | 'returned';

@Schema()
export class FunkItemEvent {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: FunkItem.name,
  })
  funkItem: FunkItem;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true })
  type: FunkItemEventType;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const FunkItemEventSchema = SchemaFactory.createForClass(FunkItemEvent);

FunkItemEventSchema.index({ funkItem: 1, date: -1 });
