import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionStats } from './schemas/question-stats.schema';
import { QuizType } from './schemas/question.schema';

export type QuestionStatsCount = {
  questionType: QuizType;
  right: number;
  wrong: number;
};

@Injectable()
export class QuestionStatsService {
  constructor(
    @InjectModel(QuestionStats.name)
    private questionStatsModel: Model<QuestionStats>,
  ) {}

  async getQuestionStatsCountForType(
    questionType: QuizType,
    questionNumber?: number,
  ): Promise<QuestionStatsCount> {
    const query = {
      questionType,
      ...(questionNumber ? { questionNumber } : {}),
    };

    return {
      questionType,
      right: await this.questionStatsModel.countDocuments({
        ...query,
        correct: true,
      }),
      wrong: await this.questionStatsModel.countDocuments({
        ...query,
        correct: false,
      }),
    };
  }

  async addQuestionStats(
    questionType: QuizType,
    questionNumber: number,
    correct: boolean,
    timestamp: Date,
  ) {
    const newQuestionStats = new this.questionStatsModel({
      questionType,
      questionNumber,
      correct,
      timestamp,
    });

    return newQuestionStats.save();
  }
}
