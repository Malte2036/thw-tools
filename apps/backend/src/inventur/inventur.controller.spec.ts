import { Test, TestingModule } from '@nestjs/testing';
import { InventurController } from './inventur.controller';

describe('InventurController', () => {
  let controller: InventurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventurController],
    }).compile();

    controller = module.get<InventurController>(InventurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
