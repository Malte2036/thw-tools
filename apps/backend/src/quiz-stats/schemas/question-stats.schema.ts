import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuizType } from './question.schema';

export type QuestionStatsDocument = HydratedDocument<QuestionStats>;

@Schema()
export class QuestionStats {
  @Prop({ required: true })
  questionType: QuizType;

  @Prop({ required: true })
  questionNumber: number;

  @Prop({ required: true })
  correct: boolean;

  @Prop({ required: true })
  timestamp: Date;
}

export const QuestionStatsSchema = SchemaFactory.createForClass(QuestionStats);

QuestionStatsSchema.index({ questionType: 1, questionNumber: 1, correct: 1 });
QuestionStatsSchema.index({ questionType: 1, correct: 1 });
