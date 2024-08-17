import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  kinde_id: string;

  @Prop({ required: false })
  first_name: string;

  @Prop({ required: false })
  last_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
