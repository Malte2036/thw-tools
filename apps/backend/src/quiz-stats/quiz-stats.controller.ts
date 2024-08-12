import { Controller, Get, Param } from '@nestjs/common';
import { QuestionsStatsCount, QuizStatsService } from './quiz-stats.service';
import { QuizType } from './schemas/question-stats.schema';

@Controller('quiz')
export class QuizStatsController {
  constructor(private readonly quizStatsService: QuizStatsService) {}

  @Get(':type/stats/count')
  async getQuestionStatsCountForType(
    @Param('type') type: QuizType,
  ): Promise<QuestionsStatsCount> {
    return this.quizStatsService.getQuestionStatsCountForType(type);
  }

  @Get(':type/stats/count/:number')
  async getQuestionStatsCountForTypeAndNumber(
    @Param('type') type: QuizType,
    @Param('number') number: number,
  ): Promise<QuestionsStatsCount> {
    return this.quizStatsService.getQuestionStatsCountForType(type, number);
  }
}
