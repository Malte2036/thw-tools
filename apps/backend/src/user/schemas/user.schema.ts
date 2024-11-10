import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  kindeId: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  picture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
