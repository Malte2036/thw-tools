import { Injectable, Logger } from '@nestjs/common';
import {
  CreateQuestionDto,
  Question,
  QuizType,
} from './schemas/question.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { readFile } from 'fs/promises';
import {
  CreateQuestionAnswerDto,
  QuestionAnswer,
} from './schemas/question-answer.schema';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionAnswer)
    private questionAnswerRepository: Repository<QuestionAnswer>,
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

  private async importQuestionsFromJson(): Promise<void> {
    const path = join(__dirname, '../../quiz.questions.json');
    const questionData = await readFile(path, 'utf8');

    type QuestionJsonEntry = {
      type: string;
      number: number;
      text: string;
      image: string | null;
      answers: Record<number, string>;
      correctIndices: number[];
    };

    const questions: QuestionJsonEntry[] = JSON.parse(questionData);
    this.logger.log(`Found ${questions.length} questions in the JSON file.`);

    for (const questionEntry of questions) {
      this.logger.log(
        `Processing question with type ${questionEntry.type} and number ${questionEntry.number}`,
      );

      this.logger.log(questionEntry.type);

      // Check if the question already exists
      const existingQuestion = await this.questionRepository.findOne({
        where: {
          type: questionEntry.type as QuizType,
          number: questionEntry.number,
        },
      });

      if (existingQuestion) {
        throw new Error(
          `Question with type ${questionEntry.type} and number ${questionEntry.number} already exists.`,
        );
      }

      // Create and save the question
      const createQuestionDto: CreateQuestionDto = {
        type: questionEntry.type as QuizType,
        number: questionEntry.number,
        text: questionEntry.text,
        image: questionEntry.image,

        answers: [], // Will populate below
      };

      const savedQuestion =
        await this.questionRepository.save(createQuestionDto);

      // Create and save answers
      const createAnswerDtos: CreateQuestionAnswerDto[] = Object.entries(
        questionEntry.answers,
      ).map(([key, answerText]) => ({
        text: answerText,
        isCorrect: questionEntry.correctIndices
          .map((i) => Number(i))
          .includes(Number(key)),
        question: savedQuestion,
      }));

      await this.questionAnswerRepository.save(createAnswerDtos);
    }

    this.logger.log('Questions imported successfully!');
  }
}
