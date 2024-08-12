import { Test, TestingModule } from '@nestjs/testing';
import { QuizStatsService } from './quiz-stats.service';

describe('QuizStatsService', () => {
  let service: QuizStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizStatsService],
    }).compile();

    service = module.get<QuizStatsService>(QuizStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
