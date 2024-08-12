import { Test, TestingModule } from '@nestjs/testing';
import { QuestionStatsService } from './question-stats.service';

describe('QuestionStatsService', () => {
  let service: QuestionStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionStatsService],
    }).compile();

    service = module.get<QuestionStatsService>(QuestionStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
