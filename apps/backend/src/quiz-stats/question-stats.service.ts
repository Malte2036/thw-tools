import { Injectable } from '@nestjs/common';
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
      right: parseInt(result.correctCount, 10) || 0,
      wrong: parseInt(result.incorrectCount, 10) || 0,
    };
  }

  async getQuestionStatsCountForType(
    questionType: QuizType,
  ): Promise<QuestionStatsCount> {
    const result = await this.questionStatsRepository
      .createQueryBuilder('stats')
      .innerJoin('stats.question', 'question') // Join with the `Question` table
      .select([
        'SUM(CASE WHEN stats.correct = true THEN 1 ELSE 0 END) AS "correctCount"',
        'SUM(CASE WHEN stats.correct = false THEN 1 ELSE 0 END) AS "incorrectCount"',
      ])
      .where('question.type = :questionType', { questionType })
      .getRawOne();

    return {
      right: parseInt(result.correctCount, 10) || 0,
      wrong: parseInt(result.incorrectCount, 10) || 0,
    };
  }

  async addQuestionStats(createQuestionStatsDto: CreateQuestionStatsDto) {
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

    const createQuestionStatsDto: CreateQuestionStatsDto = {
      correct,
      timestamp,
      question,
    };

    return this.questionStatsRepository.save(createQuestionStatsDto);
  }
}
