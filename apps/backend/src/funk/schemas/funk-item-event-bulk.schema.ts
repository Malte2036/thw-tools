import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { FunkItemEvent, FunkItemEventType } from './funk-item-event.schema';
import { Organisation } from 'src/organisation/schemas/organisation.schema';

export type FunkItemEventBulkDocument = HydratedDocument<FunkItemEventBulk>;

@Schema()
export class FunkItemEventBulk {
  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: FunkItemEvent.name,
      },
    ],
  })
  funkItemEvents: FunkItemEvent[];

  @Prop({ required: true })
  eventType: FunkItemEventType;

  @Prop({ required: false, default: 0 })
  batteryCount: number;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Organisation.name,
  })
  organisation: Organisation;

  @Prop({ required: true, default: Date.now })
  date: Date;
}

export const FunkItemEventBulkSchema =
  SchemaFactory.createForClass(FunkItemEventBulk);
