import { Test, TestingModule } from '@nestjs/testing';
import { LefletPeriodService } from './leflet-period.service';

describe('LefletPeriodService', () => {
  let service: LefletPeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LefletPeriodService],
    }).compile();

    service = module.get<LefletPeriodService>(LefletPeriodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
