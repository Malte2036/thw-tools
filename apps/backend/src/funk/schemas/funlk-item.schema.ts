import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { inventarNummerRegex } from 'src/inventory/schemas/inventory-item.schema';
import { Organisation } from 'src/organisation/schemas/organisation.schema';

export type FunkItemDocument = HydratedDocument<FunkItem>;

@Schema()
export class FunkItem {
  @Prop({ required: true, match: inventarNummerRegex })
  deviceId: string;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Organisation.name,
  })
  organisation: Organisation;
}

export const FunkItemSchema = SchemaFactory.createForClass(FunkItem);
