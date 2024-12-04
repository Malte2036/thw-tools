import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuizType } from './schemas/question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async getQuestions(questionType: QuizType): Promise<Question[]> {
    return this.questionRepository.find({
      where: {
        type: questionType,
      },
      relations: ['answers'],
    });
  }

  async getQuestion(
    questionType: QuizType,
    questionNumber: number,
  ): Promise<Question | null> {
    return this.questionRepository.findOne({
      where: {
        type: questionType,
        number: questionNumber,
      },
      relations: ['answers'],
    });
  }

  async getQuestionCount(questionType: QuizType): Promise<number> {
    return this.questionRepository.count({
      where: {
        type: questionType,
      },
    });
  }

  async getTotalQuestionCount(): Promise<number> {
    return this.questionRepository.count();
  }
}
