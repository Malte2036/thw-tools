import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuizType } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(questionType: QuizType) {
    return this.prisma.question.findMany({
      where: {
        type: questionType,
      },
      include: {
        answers: true,
      },
    });
  }

  async getQuestion(questionType: QuizType, questionNumber: number) {
    return this.prisma.question.findFirst({
      where: {
        type: questionType,
        number: questionNumber,
      },
      include: {
        answers: true,
      },
    });
  }

  async getQuestionCount(questionType: QuizType): Promise<number> {
    return this.prisma.question.count({
      where: {
        type: questionType,
      },
    });
  }

  async getTotalQuestionCount(): Promise<number> {
    return this.prisma.question.count();
  }
}
