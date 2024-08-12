import { Module } from '@nestjs/common';
import { QuizStatsService } from './quiz-stats.service';
import { QuizStatsController } from './quiz-stats.controller';
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
  providers: [QuizStatsService],
  controllers: [QuizStatsController],
})
export class QuizStatsModule {}
