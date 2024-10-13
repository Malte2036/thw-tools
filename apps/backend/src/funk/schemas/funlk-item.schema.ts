import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Organisation } from 'src/organisation/schemas/organisation.schema';

export type FunkItemDocument = HydratedDocument<FunkItem>;

export type FunkDeviceId = string;

@Schema()
export class FunkItem {
  @Prop({ required: true })
  deviceId: FunkDeviceId;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Organisation.name,
  })
  organisation: Organisation;
}

export const FunkItemSchema = SchemaFactory.createForClass(FunkItem);
