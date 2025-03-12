import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from '../prisma/prisma.service';
import { QuizType } from '@prisma/client';

describe('QuestionService', () => {
  let service: QuestionService;
  let prisma: PrismaService;

  const mockQuestion = {
    id: 1,
    type: QuizType.ga,
    number: 1,
    text: 'Test question?',
    image: null,
    answers: [],
  };

  const mockPrisma = {
    question: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuestions', () => {
    it('should return an array of questions for a given type', async () => {
      const questions = [mockQuestion];
      mockPrisma.question.findMany.mockResolvedValue(questions);

      const result = await service.getQuestions(QuizType.ga);

      expect(result).toEqual(questions);
      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: { type: QuizType.ga },
        include: { answers: true },
      });
    });

    it('should return empty array when no questions found', async () => {
      mockPrisma.question.findMany.mockResolvedValue([]);

      const result = await service.getQuestions(QuizType.ga);

      expect(result).toEqual([]);
      expect(prisma.question.findMany).toHaveBeenCalled();
    });

    // Edge case: Special characters in question text
    it('should handle questions with special characters', async () => {
      const questionWithSpecialChars = {
        ...mockQuestion,
        text: 'Test question with @#$%^&* characters?',
      };
      mockPrisma.question.findMany.mockResolvedValue([
        questionWithSpecialChars,
      ]);

      const result = await service.getQuestions(QuizType.ga);

      expect(result).toEqual([questionWithSpecialChars]);
    });

    // Edge case: Questions with empty answers array
    it('should handle questions with empty answers array', async () => {
      const questionWithNoAnswers = {
        ...mockQuestion,
        answers: [],
      };
      mockPrisma.question.findMany.mockResolvedValue([questionWithNoAnswers]);

      const result = await service.getQuestions(QuizType.ga);

      expect(result).toEqual([questionWithNoAnswers]);
    });
  });

  describe('getQuestion', () => {
    it('should return a single question by type and number', async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockQuestion);

      const result = await service.getQuestion(QuizType.ga, 1);

      expect(result).toEqual(mockQuestion);
      expect(prisma.question.findFirst).toHaveBeenCalledWith({
        where: { type: QuizType.ga, number: 1 },
        include: { answers: true },
      });
    });

    it('should return null when question not found', async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null);

      const result = await service.getQuestion(QuizType.ga, 999);

      expect(result).toBeNull();
      expect(prisma.question.findFirst).toHaveBeenCalled();
    });

    // Edge case: Negative question numbers
    it('should handle negative question numbers', async () => {
      const result = await service.getQuestion(QuizType.ga, -1);

      expect(result).toBeNull();
      expect(prisma.question.findFirst).toHaveBeenCalledWith({
        where: { type: QuizType.ga, number: -1 },
        include: { answers: true },
      });
    });

    // Edge case: Zero question number
    it('should handle zero question number', async () => {
      const result = await service.getQuestion(QuizType.ga, 0);

      expect(result).toBeNull();
      expect(prisma.question.findFirst).toHaveBeenCalledWith({
        where: { type: QuizType.ga, number: 0 },
        include: { answers: true },
      });
    });
  });

  describe('getQuestionCount', () => {
    it('should return count of questions for a given type', async () => {
      mockPrisma.question.count.mockResolvedValue(5);

      const result = await service.getQuestionCount(QuizType.ga);

      expect(result).toBe(5);
      expect(prisma.question.count).toHaveBeenCalledWith({
        where: { type: QuizType.ga },
      });
    });

    it('should return 0 when no questions exist for type', async () => {
      mockPrisma.question.count.mockResolvedValue(0);

      const result = await service.getQuestionCount(QuizType.cbrn);

      expect(result).toBe(0);
      expect(prisma.question.count).toHaveBeenCalled();
    });

    // Edge case: Large number of questions
    it('should handle large number of questions', async () => {
      mockPrisma.question.count.mockResolvedValue(1000000);

      const result = await service.getQuestionCount(QuizType.ga);

      expect(result).toBe(1000000);
    });
  });

  describe('getTotalQuestionCount', () => {
    it('should return total count of all questions', async () => {
      mockPrisma.question.count.mockResolvedValue(10);

      const result = await service.getTotalQuestionCount();

      expect(result).toBe(10);
      expect(prisma.question.count).toHaveBeenCalled();
    });

    // Edge case: No questions in database
    it('should handle empty database', async () => {
      mockPrisma.question.count.mockResolvedValue(0);

      const result = await service.getTotalQuestionCount();

      expect(result).toBe(0);
    });
  });
});
