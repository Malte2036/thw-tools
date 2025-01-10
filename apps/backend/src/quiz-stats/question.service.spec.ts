import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question, QuizType } from './schemas/question.schema';
import { Repository } from 'typeorm';

describe('QuestionService', () => {
  let service: QuestionService;
  let repository: Repository<Question>;

  const mockQuestion: Question = {
    id: 1,
    type: QuizType.GA,
    number: 1,
    text: 'Test question?',
    image: null,
    answers: [],
    stats: [],
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    repository = module.get<Repository<Question>>(getRepositoryToken(Question));
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
      mockRepository.find.mockResolvedValue(questions);

      const result = await service.getQuestions(QuizType.GA);

      expect(result).toEqual(questions);
      expect(repository.find).toHaveBeenCalledWith({
        where: { type: QuizType.GA },
        relations: ['answers'],
      });
    });

    it('should return empty array when no questions found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getQuestions(QuizType.GA);

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });

    // Edge case: Special characters in question text
    it('should handle questions with special characters', async () => {
      const questionWithSpecialChars: Question = {
        ...mockQuestion,
        text: 'Test question with @#$%^&* characters?',
      };
      mockRepository.find.mockResolvedValue([questionWithSpecialChars]);

      const result = await service.getQuestions(QuizType.GA);

      expect(result).toEqual([questionWithSpecialChars]);
    });

    // Edge case: Questions with empty answers array
    it('should handle questions with empty answers array', async () => {
      const questionWithNoAnswers: Question = {
        ...mockQuestion,
        answers: [],
      };
      mockRepository.find.mockResolvedValue([questionWithNoAnswers]);

      const result = await service.getQuestions(QuizType.GA);

      expect(result).toEqual([questionWithNoAnswers]);
    });
  });

  describe('getQuestion', () => {
    it('should return a single question by type and number', async () => {
      mockRepository.findOne.mockResolvedValue(mockQuestion);

      const result = await service.getQuestion(QuizType.GA, 1);

      expect(result).toEqual(mockQuestion);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { type: QuizType.GA, number: 1 },
        relations: ['answers'],
      });
    });

    it('should return null when question not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getQuestion(QuizType.GA, 999);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalled();
    });

    // Edge case: Negative question numbers
    it('should handle negative question numbers', async () => {
      const result = await service.getQuestion(QuizType.GA, -1);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { type: QuizType.GA, number: -1 },
        relations: ['answers'],
      });
    });

    // Edge case: Zero question number
    it('should handle zero question number', async () => {
      const result = await service.getQuestion(QuizType.GA, 0);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { type: QuizType.GA, number: 0 },
        relations: ['answers'],
      });
    });
  });

  describe('getQuestionCount', () => {
    it('should return count of questions for a given type', async () => {
      mockRepository.count.mockResolvedValue(5);

      const result = await service.getQuestionCount(QuizType.GA);

      expect(result).toBe(5);
      expect(repository.count).toHaveBeenCalledWith({
        where: { type: QuizType.GA },
      });
    });

    it('should return 0 when no questions exist for type', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getQuestionCount(QuizType.CBRN);

      expect(result).toBe(0);
      expect(repository.count).toHaveBeenCalled();
    });

    // Edge case: Large number of questions
    it('should handle large number of questions', async () => {
      mockRepository.count.mockResolvedValue(1000000);

      const result = await service.getQuestionCount(QuizType.GA);

      expect(result).toBe(1000000);
    });
  });

  describe('getTotalQuestionCount', () => {
    it('should return total count of all questions', async () => {
      mockRepository.count.mockResolvedValue(10);

      const result = await service.getTotalQuestionCount();

      expect(result).toBe(10);
      expect(repository.count).toHaveBeenCalled();
    });

    // Edge case: No questions in database
    it('should handle empty database', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getTotalQuestionCount();

      expect(result).toBe(0);
    });
  });
});
