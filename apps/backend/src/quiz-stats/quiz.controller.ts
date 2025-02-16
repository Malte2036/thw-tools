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
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { QuizType } from '@prisma/client';
import {
  QuestionStatsCount,
  QuestionStatsService,
} from './question-stats.service';
import { QuestionService } from './question.service';

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

  @Get(':questionType/count')
  async getQuestionCount(@Param('questionType') questionType: QuizType) {
    return this.questionService.getQuestionCount(questionType);
  }

  @Get(':questionType')
  async getQuestions(@Param('questionType') questionType: QuizType) {
    const questions = await this.questionService.getQuestions(questionType);
    return questions;
  }

  @Get(':questionType/:questionNumber')
  async getQuestion(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: string,
  ) {
    const question = await this.questionService.getQuestion(
      questionType,
      parseInt(questionNumber, 10),
    );

    if (!question) {
      Logger.warn(
        `Question not found for ${questionType} question ${questionNumber}`,
      );
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return question;
  }

  @Get(':questionType/:questionNumber/stats/count')
  async getQuestionStatsCount(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: string,
  ): Promise<QuestionStatsCount> {
    const question = await this.questionService.getQuestion(
      questionType,
      parseInt(questionNumber, 10),
    );

    if (!question) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return this.questionStatsService.getQuestionStatsCountByQuestionId(
      question.id,
    );
  }

  // Deprecated, use /quiz/stats/count/:questionId instead
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Post(':questionType/stats/count/:questionNumber')
  async addQuestionStatsDeprecated(
    @Param('questionType') questionType: QuizType,
    @Param('questionNumber') questionNumber: string,
    @Body() body: { correct: boolean; timestamp?: string },
  ) {
    try {
      const timestamp = body.timestamp ? new Date(body.timestamp) : new Date();

      return await this.questionStatsService.addQuestionStatsDeprecated(
        questionType,
        parseInt(questionNumber, 10),
        body.correct,
        timestamp,
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

  @Get(':questionType/stats/count')
  async getQuestionStatsCountForType(
    @Param('questionType') questionType: QuizType,
  ): Promise<QuestionStatsCount> {
    return this.questionStatsService.getQuestionStatsCountForType(questionType);
  }

  @Post('stats/count/:questionId')
  async addQuestionStatsById(
    @Param('questionId') questionId: string,
    @Body() data: { correct: boolean },
  ) {
    try {
      await this.questionStatsService.addQuestionStats({
        questionId: parseInt(questionId, 10),
        correct: data.correct,
        timestamp: new Date(),
      });

      Logger.log(`Added question stats for question with id ${questionId}`);
    } catch (error) {
      Logger.error(
        `Failed to add question stats for question with id ${questionId}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to add question stats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('stats/count/:questionId')
  async getQuestionStatsCountByQuestionId(
    @Param('questionId') questionId: string,
  ) {
    return this.questionStatsService.getQuestionStatsCountByQuestionId(
      parseInt(questionId, 10),
    );
  }
}
