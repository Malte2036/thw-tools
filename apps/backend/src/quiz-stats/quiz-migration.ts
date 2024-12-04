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
import {
  CreateQuestionStatsDto,
  QuestionStats,
} from './schemas/question-stats.schema';

@Injectable()
export class QuestionMigrationService {
  private readonly logger = new Logger(QuestionMigrationService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionAnswer)
    private questionAnswerRepository: Repository<QuestionAnswer>,
    @InjectRepository(QuestionStats)
    private questionStatsRepository: Repository<QuestionStats>,
  ) {}

  async importQuestionsFromJson(): Promise<void> {
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
        stats: [],
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

  async importQuestionStatsFromJson(): Promise<void> {
    const inputPath = join(__dirname, '../../quiz.questionstats.json');

    type OldQuestionStatsEntry = {
      questionType: string;
      questionNumber: number;
      correct: boolean;
      timestamp: {
        $date: string;
      };
      __v: number;
    };

    // Read and parse the old JSON file
    const oldStatsData: OldQuestionStatsEntry[] = JSON.parse(
      await readFile(inputPath, 'utf8'),
    );

    this.logger.log(
      `Found ${oldStatsData.length} question stats in the JSON file.`,
    );

    for (const oldStatsEntry of oldStatsData) {
      const question = await this.questionRepository.findOne({
        where: {
          type: oldStatsEntry.questionType as QuizType,
          number: oldStatsEntry.questionNumber,
        },
      });

      if (!question) {
        this.logger.error(
          `Question with type ${oldStatsEntry.questionType} and number ${oldStatsEntry.questionNumber} not found.`,
        );
        continue;
      }

      const createQuestionStatsDto: CreateQuestionStatsDto = {
        question: question,
        correct: oldStatsEntry.correct,
        timestamp: new Date(oldStatsEntry.timestamp.$date),
      };

      await this.questionStatsRepository.save(createQuestionStatsDto);
      // this.logger.log(
      //   `Imported question stats for question with type ${oldStatsEntry.questionType} and number ${oldStatsEntry.questionNumber}`,
      // );
    }

    this.logger.log('Question stats imported successfully!');
  }
}
