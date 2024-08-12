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
import { QuizType } from './schemas/question-stats.schema';
import {
  QuestionStatsCount,
  QuestionStatsService,
} from './question-stats.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly questionStatsService: QuestionStatsService) {}

  @Get(':questionType/stats/count')
  async getQuestionStatsCountForType(
    @Param('questionType') questionType: QuizType,
  ): Promise<QuestionStatsCount> {
    return this.questionStatsService.getQuestionStatsCountForType(questionType);
  }

  @Get(':questionType/stats/count/:questionNumber')
  async getQuestionStatsCountForTypeAndNumber(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: number,
  ): Promise<QuestionStatsCount> {
    return this.questionStatsService.getQuestionStatsCountForType(
      questionType,
      questionNumber,
    );
  }

  @Post(':questionType/stats/count/:questionNumber')
  async addQuestionStats(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: number,
    @Body() data: { correct: boolean },
  ) {
    try {
      await this.questionStatsService.addQuestionStats(
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
