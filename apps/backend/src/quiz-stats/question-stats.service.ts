import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateQuestionStatsDto,
  QuestionStats,
} from './schemas/question-stats.schema';
import { QuizType } from './schemas/question.schema';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionService } from './question.service';

export type QuestionStatsCount = {
  right: number;
  wrong: number;
};

@Injectable()
export class QuestionStatsService {
  constructor(
    private questionService: QuestionService,
    @InjectRepository(QuestionStats)
    private questionStatsRepository: Repository<QuestionStats>,
  ) {}

  async getQuestionStatsCountByQuestionId(
    questionId: number,
  ): Promise<QuestionStatsCount> {
    if (questionId < 0) {
      return { right: 0, wrong: 0 };
    }

    const result = await this.questionStatsRepository
      .createQueryBuilder('stats')
      .innerJoin('stats.question', 'question')
      .select([
        'SUM(CASE WHEN stats.correct = true THEN 1 ELSE 0 END) AS "correctCount"',
        'SUM(CASE WHEN stats.correct = false THEN 1 ELSE 0 END) AS "incorrectCount"',
      ])
      .where('question.id = :questionId', { questionId })
      .getRawOne();

    return {
      right: parseInt(result?.correctCount ?? '0', 10) || 0,
      wrong: parseInt(result?.incorrectCount ?? '0', 10) || 0,
    };
  }

  async getQuestionStatsCountForType(
    questionType: QuizType,
  ): Promise<QuestionStatsCount> {
    const result = await this.questionStatsRepository
      .createQueryBuilder('stats')
      .innerJoin('stats.question', 'question')
      .select([
        'SUM(CASE WHEN stats.correct = true THEN 1 ELSE 0 END) AS "correctCount"',
        'SUM(CASE WHEN stats.correct = false THEN 1 ELSE 0 END) AS "incorrectCount"',
      ])
      .where('question.type = :questionType', { questionType })
      .getRawOne();

    return {
      right: parseInt(result?.correctCount ?? '0', 10) || 0,
      wrong: parseInt(result?.incorrectCount ?? '0', 10) || 0,
    };
  }

  async addQuestionStats(createQuestionStatsDto: CreateQuestionStatsDto) {
    if (
      !createQuestionStatsDto.timestamp ||
      isNaN(createQuestionStatsDto.timestamp.getTime())
    ) {
      throw new BadRequestException('Invalid timestamp');
    }

    return this.questionStatsRepository.save(createQuestionStatsDto);
  }

  async addQuestionStatsDeprecated(
    questionType: QuizType,
    questionNumber: number,
    correct: boolean,
    timestamp: Date,
  ) {
    const question = await this.questionService.getQuestion(
      questionType,
      questionNumber,
    );

    if (!question) {
      throw new BadRequestException('Question not found');
    }

    if (!timestamp || isNaN(timestamp.getTime())) {
      throw new BadRequestException('Invalid timestamp');
    }

    const createQuestionStatsDto: CreateQuestionStatsDto = {
      correct,
      timestamp,
      question,
    };

    return this.questionStatsRepository.save(createQuestionStatsDto);
  }
}
