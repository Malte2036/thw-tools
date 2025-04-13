import { Test, TestingModule } from '@nestjs/testing';
import { InventurService } from './inventur.service';

describe('InventurService', () => {
  let service: InventurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventurService],
    }).compile();

    service = module.get<InventurService>(InventurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
