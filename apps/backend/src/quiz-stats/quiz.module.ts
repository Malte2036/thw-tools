import { Module } from '@nestjs/common';
import { QuestionStatsService } from './question-stats.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionStats,
  QuestionStatsSchema,
} from './schemas/question-stats.schema';
import { Question, QuestionSchema } from './schemas/question.schema';
import { QuestionService } from './question.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
      {
        name: QuestionStats.name,
        schema: QuestionStatsSchema,
      },
    ]),
  ],
  providers: [QuestionService, QuestionStatsService],
  controllers: [QuizController],
})
export class QuizModule {}
