import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Organisation } from 'src/organisation/schemas/organisation.schema';

export type InventoryItemDocument = HydratedDocument<InventoryItem>;

export const inventarNummerRegex = /^\d{4}-S?\d{6}$/;

@Schema()
export class InventoryItem {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Organisation.name,
  })
  organisation: Organisation;

  @Prop({ required: true })
  einheit: string;

  @Prop({ required: true })
  ebene: number;

  @Prop()
  art: string;

  @Prop({ required: true })
  ausstattung: string;

  @Prop()
  hersteller: string;

  @Prop()
  typ: string;

  @Prop({ required: false, match: inventarNummerRegex })
  inventarNummer: string;

  @Prop()
  sachNummer: string;

  @Prop()
  gerateNummer: string;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
