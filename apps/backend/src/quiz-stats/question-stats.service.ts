import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuizType } from '@prisma/client';
import { QuestionService } from './question.service';

export type QuestionStatsCount = {
  right: number;
  wrong: number;
};

@Injectable()
export class QuestionStatsService {
  constructor(
    private questionService: QuestionService,
    private prisma: PrismaService,
  ) {}

  async getQuestionStatsCountByQuestionId(
    questionId: number,
  ): Promise<QuestionStatsCount> {
    if (questionId < 0) {
      return { right: 0, wrong: 0 };
    }

    const result = await this.prisma.questionStats.groupBy({
      by: ['correct'],
      where: {
        questionId,
      },
      _count: {
        correct: true,
      },
    });

    const correctCount = result.find((r) => r.correct)?._count.correct ?? 0;
    const incorrectCount = result.find((r) => !r.correct)?._count.correct ?? 0;

    return {
      right: correctCount,
      wrong: incorrectCount,
    };
  }

  async getQuestionStatsCountForType(
    questionType: QuizType,
  ): Promise<QuestionStatsCount> {
    const result = await this.prisma.questionStats.groupBy({
      by: ['correct'],
      where: {
        question: {
          type: questionType,
        },
      },
      _count: {
        correct: true,
      },
    });

    const correctCount = result.find((r) => r.correct)?._count.correct ?? 0;
    const incorrectCount = result.find((r) => !r.correct)?._count.correct ?? 0;

    return {
      right: correctCount,
      wrong: incorrectCount,
    };
  }

  async addQuestionStats(data: {
    questionId: number;
    correct: boolean;
    timestamp: Date;
  }) {
    if (!data.timestamp || isNaN(data.timestamp.getTime())) {
      throw new BadRequestException('Invalid timestamp');
    }

    return this.prisma.questionStats.create({
      data: {
        correct: data.correct,
        timestamp: data.timestamp,
        questionId: data.questionId,
      },
    });
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

    return this.prisma.questionStats.create({
      data: {
        correct,
        timestamp,
        questionId: question.id,
      },
    });
  }
}
