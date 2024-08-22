import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { InventarItemEvent } from './inventar-item-event.schema';
import { Organisation } from 'src/organisation/schemas/organisation.schema';

export type InventarItemEventBulkDocument =
  HydratedDocument<InventarItemEventBulk>;

@Schema()
export class InventarItemEventBulk {
  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: InventarItemEvent.name,
      },
    ],
  })
  inventarItemEvents: InventarItemEvent[];

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

export const InventarItemEventBulkSchema = SchemaFactory.createForClass(
  InventarItemEventBulk,
);
