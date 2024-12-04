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
import {
  QuestionStatsCount,
  QuestionStatsService,
} from './question-stats.service';
import { QuizType } from './schemas/question.schema';
import { QuestionService } from './question.service';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly questionStatsService: QuestionStatsService,
  ) {}

  @Get('count')
  async getTotalQuestionCount() {
    return this.questionService.getTotalQuestionCount();
  }

  @Get(':questionType')
  async getQuestions(@Param('questionType') questionType: QuizType) {
    const questions = await this.questionService.getQuestions(questionType);

    return questions;
  }

  @Get(':questionType/count')
  async getQuestionCount(@Param('questionType') questionType: QuizType) {
    return this.questionService.getQuestionCount(questionType);
  }

  @Get(':questionType/:questionNumber')
  async getQuestion(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: number,
  ) {
    const question = await this.questionService.getQuestion(
      questionType,
      questionNumber,
    );

    if (!question) {
      Logger.warn(
        `Question not found for ${questionType} question ${questionNumber}`,
      );
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return question;
  }

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

  @Throttle({ default: { limit: 15, ttl: 60000 } })
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
