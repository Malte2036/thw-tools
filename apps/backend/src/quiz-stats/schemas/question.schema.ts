import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuizType = 'ga' | 'agt' | 'cbrn' | 'radio';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ required: true })
  type: QuizType;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    required: true,
  })
  answers: Map<string, string>;

  @Prop({ required: true })
  correctIndices: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

QuestionSchema.index({ type: 1, number: 1 });
QuestionSchema.index({ type: 1 });
