import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { QuestionsStatsCount, QuizStatsService } from './quiz-stats.service';
import { QuizType } from './schemas/question-stats.schema';

@Controller('quiz')
export class QuizStatsController {
  constructor(private readonly quizStatsService: QuizStatsService) {}

  @Get(':questionType/stats/count')
  async getQuestionStatsCountForType(
    @Param('questionType') questionType: QuizType,
  ): Promise<QuestionsStatsCount> {
    return this.quizStatsService.getQuestionStatsCountForType(questionType);
  }

  @Get(':questionType/stats/count/:questionNumber')
  async getQuestionStatsCountForTypeAndNumber(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: number,
  ): Promise<QuestionsStatsCount> {
    return this.quizStatsService.getQuestionStatsCountForType(
      questionType,
      questionNumber,
    );
  }

  @Post(':questionType/stats/:questionNumber')
  async addQuestionStats(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: number,
    @Body() data: { correct: boolean },
  ) {
    try {
      await this.quizStatsService.addQuestionStats(
        questionType,
        questionNumber,
        data.correct,
        new Date(),
      );

      Logger.log(
        `Added question stats for ${questionType} question ${questionNumber}`,
      );
    } catch (error) {
      Logger.error(
        `Failed to add question stats for ${questionType} question ${questionNumber}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to add question stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
