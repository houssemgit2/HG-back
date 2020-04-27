import { Test, TestingModule } from '@nestjs/testing';
import { LefletPeriodController } from './leflet-period.controller';

describe('LefletPeriod Controller', () => {
  let controller: LefletPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LefletPeriodController],
    }).compile();

    controller = module.get<LefletPeriodController>(LefletPeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
