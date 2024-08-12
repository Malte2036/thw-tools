import { Test, TestingModule } from '@nestjs/testing';
import { QuizStatsController } from './quiz-stats.controller';

describe('QuizStatsController', () => {
  let controller: QuizStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizStatsController],
    }).compile();

    controller = module.get<QuizStatsController>(QuizStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
