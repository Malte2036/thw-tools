import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema()
export class Organisation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [mongoose.Types.ObjectId], ref: User.name })
  members: User[];
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
