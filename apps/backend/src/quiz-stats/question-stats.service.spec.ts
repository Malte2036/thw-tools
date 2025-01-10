import { Test, TestingModule } from '@nestjs/testing';
import { QuestionStatsService } from './question-stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionStats } from './schemas/question-stats.schema';
import { Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { Question, QuizType } from './schemas/question.schema';
import { BadRequestException } from '@nestjs/common';

describe('QuestionStatsService', () => {
  let service: QuestionStatsService;
  let repository: Repository<QuestionStats>;
  let questionService: QuestionService;

  const mockQuestion: Question = {
    id: 1,
    type: QuizType.GA,
    number: 1,
    text: 'Test question?',
    image: null,
    answers: [],
    stats: [],
  };

  const mockQuestionStats: QuestionStats = {
    id: 1,
    question: mockQuestion,
    correct: true,
    timestamp: new Date(),
  };

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockRepository = {
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockQuestionService = {
    getQuestion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionStatsService,
        {
          provide: getRepositoryToken(QuestionStats),
          useValue: mockRepository,
        },
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    service = module.get<QuestionStatsService>(QuestionStatsService);
    repository = module.get<Repository<QuestionStats>>(
      getRepositoryToken(QuestionStats),
    );
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
      const mockResult = {
        correctCount: '3',
        incorrectCount: '2',
      };

      mockQueryBuilder.getRawOne.mockResolvedValue(mockResult);

      const result = await service.getQuestionStatsCountByQuestionId(1);

      expect(result).toEqual({
        right: 3,
        wrong: 2,
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('stats');
    });

    it('should return zero counts when no stats exist', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({
        correctCount: null,
        incorrectCount: null,
      });

      const result = await service.getQuestionStatsCountByQuestionId(1);

      expect(result).toEqual({
        right: 0,
        wrong: 0,
      });
    });

    // Edge case: Malformed stat counts
    it('should handle malformed stat counts', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({
        correctCount: 'invalid',
        incorrectCount: 'NaN',
      });

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
      expect(repository.createQueryBuilder).not.toHaveBeenCalled();
    });
  });

  describe('getQuestionStatsCountForType', () => {
    it('should return stats count for a question type', async () => {
      const mockResult = {
        correctCount: '5',
        incorrectCount: '3',
      };

      mockQueryBuilder.getRawOne.mockResolvedValue(mockResult);

      const result = await service.getQuestionStatsCountForType(QuizType.GA);

      expect(result).toEqual({
        right: 5,
        wrong: 3,
      });
    });

    it('should return zero counts when no stats exist for type', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({
        correctCount: null,
        incorrectCount: null,
      });

      const result = await service.getQuestionStatsCountForType(QuizType.CBRN);

      expect(result).toEqual({
        right: 0,
        wrong: 0,
      });
    });

    // Edge case: Very large numbers
    it('should handle very large numbers', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({
        correctCount: '9999999999',
        incorrectCount: '9999999999',
      });

      const result = await service.getQuestionStatsCountForType(QuizType.GA);

      expect(result).toEqual({
        right: 9999999999,
        wrong: 9999999999,
      });
    });
  });

  describe('addQuestionStats', () => {
    it('should save new question stats', async () => {
      const createDto = {
        question: mockQuestion,
        correct: true,
        timestamp: new Date(),
      };

      mockRepository.save.mockResolvedValue(mockQuestionStats);

      const result = await service.addQuestionStats(createDto);

      expect(result).toEqual(mockQuestionStats);
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });

    // Edge case: Invalid timestamp
    it('should handle invalid timestamp', async () => {
      const createDto = {
        question: mockQuestion,
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
        question: mockQuestion,
        correct: true,
        timestamp: futureDate,
      };

      mockRepository.save.mockResolvedValue({
        ...mockQuestionStats,
        timestamp: futureDate,
      });

      const result = await service.addQuestionStats(createDto);
      expect(result.timestamp).toEqual(futureDate);
    });
  });

  describe('addQuestionStatsDeprecated', () => {
    it('should save new question stats using deprecated method', async () => {
      const timestamp = new Date();
      mockQuestionService.getQuestion.mockResolvedValue(mockQuestion);
      mockRepository.save.mockResolvedValue(mockQuestionStats);

      const result = await service.addQuestionStatsDeprecated(
        QuizType.GA,
        1,
        true,
        timestamp,
      );

      expect(result).toEqual(mockQuestionStats);
      expect(questionService.getQuestion).toHaveBeenCalledWith(QuizType.GA, 1);
      expect(repository.save).toHaveBeenCalledWith({
        question: mockQuestion,
        correct: true,
        timestamp,
      });
    });

    it('should handle question not found scenario', async () => {
      mockQuestionService.getQuestion.mockResolvedValue(null);

      await expect(
        service.addQuestionStatsDeprecated(QuizType.GA, 999, true, new Date()),
      ).rejects.toThrow(BadRequestException);
    });

    // Edge case: Multiple concurrent stats for same question
    it('should handle multiple concurrent stats for same question', async () => {
      const timestamp = new Date();
      mockQuestionService.getQuestion.mockResolvedValue(mockQuestion);

      // Simulate concurrent saves
      const promises = [
        service.addQuestionStatsDeprecated(QuizType.GA, 1, true, timestamp),
        service.addQuestionStatsDeprecated(QuizType.GA, 1, false, timestamp),
      ];

      mockRepository.save
        .mockResolvedValueOnce({ ...mockQuestionStats, correct: true })
        .mockResolvedValueOnce({ ...mockQuestionStats, correct: false });

      const results = await Promise.all(promises);
      expect(results).toHaveLength(2);
      expect(results[0].correct).toBe(true);
      expect(results[1].correct).toBe(false);
    });
  });
});
