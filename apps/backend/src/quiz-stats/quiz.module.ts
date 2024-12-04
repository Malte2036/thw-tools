import { Module } from '@nestjs/common';
import { QuestionStatsService } from './question-stats.service';
import { QuizController } from './quiz.controller';
import { QuestionStats } from './schemas/question-stats.schema';
import { Question } from './schemas/question.schema';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionAnswer } from './schemas/question-answer.schema';
import { QuestionMigrationService } from './quiz-migration';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionAnswer, QuestionStats]),
  ],
  providers: [QuestionService, QuestionStatsService, QuestionMigrationService],
  controllers: [QuizController],
})
export class QuizModule {}
