import { Module } from '@nestjs/common';
import { QuestionStatsService } from './question-stats.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionStats,
  QuestionStatsSchema,
} from './schemas/question-stats.schema';
import { Question } from './schemas/question.schema';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionAnswer } from './schemas/question-answer.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionAnswer]),
    MongooseModule.forFeature([
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
