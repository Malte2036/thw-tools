import { Test, TestingModule } from '@nestjs/testing';
import { QuestionStatsService } from './question-stats.service';
import { PrismaService } from '../prisma/prisma.service';
import { QuizType } from '@prisma/client';
import { QuestionService } from './question.service';
import { BadRequestException } from '@nestjs/common';

describe('QuestionStatsService', () => {
  let service: QuestionStatsService;
  let prisma: PrismaService;
  let questionService: QuestionService;

  const mockQuestion = {
    id: 1,
    type: QuizType.ga,
    number: 1,
    text: 'Test question?',
    image: null,
    answers: [],
  };

  const mockQuestionStats = {
    id: 1,
    questionId: mockQuestion.id,
    correct: true,
    timestamp: new Date(),
  };

  const mockPrisma = {
    questionStats: {
      groupBy: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockQuestionService = {
    getQuestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionStatsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    service = module.get<QuestionStatsService>(QuestionStatsService);
    prisma = module.get<PrismaService>(PrismaService);
    questionService = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuestionStatsCountByQuestionId', () => {
    it('should return stats count for a specific question', async () => {
      const mockResult = [
        { correct: true, _count: { correct: 3 } },
        { correct: false, _count: { correct: 2 } },
      ];

      mockPrisma.questionStats.groupBy.mockResolvedValue(mockResult);

      const result = await service.getQuestionStatsCountByQuestionId(1);

      expect(result).toEqual({
        right: 3,
        wrong: 2,
      });
      expect(prisma.questionStats.groupBy).toHaveBeenCalledWith({
        by: ['correct'],
        where: { questionId: 1 },
        _count: { correct: true },
      });
    });

    it('should return zero counts when no stats exist', async () => {
      mockPrisma.questionStats.groupBy.mockResolvedValue([]);

      const result = await service.getQuestionStatsCountByQuestionId(1);

      expect(result).toEqual({
        right: 0,
        wrong: 0,
      });
    });

    // Edge case: Negative question ID
    it('should handle negative question ID', async () => {
      const result = await service.getQuestionStatsCountByQuestionId(-1);

      expect(result).toEqual({
        right: 0,
        wrong: 0,
      });
      expect(prisma.questionStats.groupBy).not.toHaveBeenCalled();
    });
  });

  describe('getQuestionStatsCountForType', () => {
    it('should return stats count for a question type', async () => {
      const mockResult = [
        { correct: true, _count: { correct: 5 } },
        { correct: false, _count: { correct: 3 } },
      ];

      mockPrisma.questionStats.groupBy.mockResolvedValue(mockResult);

      const result = await service.getQuestionStatsCountForType(QuizType.ga);

      expect(result).toEqual({
        right: 5,
        wrong: 3,
      });
      expect(prisma.questionStats.groupBy).toHaveBeenCalledWith({
        by: ['correct'],
        where: {
          question: {
            type: QuizType.ga,
          },
        },
        _count: { correct: true },
      });
    });

    it('should return zero counts when no stats exist for type', async () => {
      mockPrisma.questionStats.groupBy.mockResolvedValue([]);

      const result = await service.getQuestionStatsCountForType(QuizType.cbrn);

      expect(result).toEqual({
        right: 0,
        wrong: 0,
      });
    });

    // Edge case: Very large numbers
    it('should handle very large numbers', async () => {
      const mockResult = [
        { correct: true, _count: { correct: 9999999999 } },
        { correct: false, _count: { correct: 9999999999 } },
      ];

      mockPrisma.questionStats.groupBy.mockResolvedValue(mockResult);

      const result = await service.getQuestionStatsCountForType(QuizType.ga);

      expect(result).toEqual({
        right: 9999999999,
        wrong: 9999999999,
      });
    });
  });

  describe('addQuestionStats', () => {
    it('should create new question stats', async () => {
      const createDto = {
        questionId: 1,
        correct: true,
        timestamp: new Date(),
      };

      mockPrisma.questionStats.create.mockResolvedValue(mockQuestionStats);

      const result = await service.addQuestionStats(createDto);

      expect(result).toEqual(mockQuestionStats);
      expect(prisma.questionStats.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    // Edge case: Invalid timestamp
    it('should handle invalid timestamp', async () => {
      const createDto = {
        questionId: 1,
        correct: true,
        timestamp: new Date('invalid date'),
      };

      await expect(service.addQuestionStats(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    // Edge case: Future timestamp
    it('should handle future timestamp', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const createDto = {
        questionId: 1,
        correct: true,
        timestamp: futureDate,
      };

      mockPrisma.questionStats.create.mockResolvedValue({
        ...mockQuestionStats,
        timestamp: futureDate,
      });

      const result = await service.addQuestionStats(createDto);
      expect(result.timestamp).toEqual(futureDate);
    });
  });

  describe('addQuestionStatsDeprecated', () => {
    it('should create new question stats using deprecated method', async () => {
      const timestamp = new Date();
      mockQuestionService.getQuestion.mockResolvedValue(mockQuestion);
      mockPrisma.questionStats.create.mockResolvedValue(mockQuestionStats);

      const result = await service.addQuestionStatsDeprecated(
        QuizType.ga,
        1,
        true,
        timestamp,
      );

      expect(result).toEqual(mockQuestionStats);
      expect(questionService.getQuestion).toHaveBeenCalledWith(QuizType.ga, 1);
      expect(prisma.questionStats.create).toHaveBeenCalledWith({
        data: {
          correct: true,
          timestamp,
          questionId: mockQuestion.id,
        },
      });
    });

    // Edge case: Question not found
    it('should throw error when question not found', async () => {
      mockQuestionService.getQuestion.mockResolvedValue(null);

      await expect(
        service.addQuestionStatsDeprecated(QuizType.ga, 999, true, new Date()),
      ).rejects.toThrow(BadRequestException);
    });

    // Edge case: Invalid timestamp
    it('should throw error with invalid timestamp', async () => {
      mockQuestionService.getQuestion.mockResolvedValue(mockQuestion);

      await expect(
        service.addQuestionStatsDeprecated(
          QuizType.ga,
          1,
          true,
          new Date('invalid'),
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
