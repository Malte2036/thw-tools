import { Module } from '@nestjs/common';
import { QuestionStatsService } from './question-stats.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuestionStats,
  QuestionStatsSchema,
} from './schemas/question-stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionStats.name,
        schema: QuestionStatsSchema,
      },
    ]),
  ],
  providers: [QuestionStatsService],
  controllers: [QuizController],
})
export class QuizModule {}
