import { Test, TestingModule } from '@nestjs/testing';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

describe('MissionsController', () => {
  let controller: MissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionsController],
      providers: [MissionsService],
    }).compile();

    controller = module.get<MissionsController>(MissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
