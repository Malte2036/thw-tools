import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionStats, QuizType } from './schemas/question-stats.schema';

export type QuestionsStatsCount = {
  questionType: QuizType;
  count: number;
  correct: number;
};

@Injectable()
export class QuizStatsService {
  constructor(
    @InjectModel(QuestionStats.name)
    private questionStatsModel: Model<QuestionStats>,
  ) {}

  async getQuestionStatsCountForType(
    questionType: QuizType,
    questionNumber?: number,
  ): Promise<QuestionsStatsCount> {
    const query = {
      questionType,
      ...(questionNumber ? { questionNumber } : {}),
    };

    return {
      questionType,
      count: await this.questionStatsModel.countDocuments(query),
      correct: await this.questionStatsModel.countDocuments({
        ...query,
        correct: true,
      }),
    };
  }
}
