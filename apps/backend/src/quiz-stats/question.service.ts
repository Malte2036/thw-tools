import { Injectable } from '@nestjs/common';
import {
  Question,
  QuestionDocument,
  QuizType,
} from './schemas/question.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<Question>,
  ) {}

  async getQuestions(questionType: QuizType): Promise<QuestionDocument[]> {
    const query: Partial<Question> = {
      type: questionType,
    };

    return this.questionModel.find(query);
  }

  async getQuestion(
    questionType: QuizType,
    questionNumber: number,
  ): Promise<QuestionDocument | null> {
    const query: Partial<Question> = {
      type: questionType,
      number: questionNumber,
    };

    return this.questionModel.findOne(query);
  }

  async getQuestionCount(questionType: QuizType): Promise<number> {
    const query: Partial<Question> = {
      type: questionType,
    };

    return this.questionModel.countDocuments(query);
  }
}
