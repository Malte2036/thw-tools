import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type OrganisationDocument = HydratedDocument<Organisation>;

@Schema()
export class Organisation {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }],
  })
  members: User[];

  @Prop({
    required: true,
  })
  inviteCode: string;
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation);
