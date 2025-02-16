import { Module } from '@nestjs/common';
import { QuestionStatsService } from './question-stats.service';
import { QuizController } from './quiz.controller';
import { QuestionService } from './question.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuestionService, QuestionStatsService],
  controllers: [QuizController],
})
export class QuizModule {}
