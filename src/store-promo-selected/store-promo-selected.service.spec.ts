import { Test, TestingModule } from '@nestjs/testing';
import { StorePromoSelectedService } from './store-promo-selected.service';

describe('StorePromoSelectedService', () => {
  let service: StorePromoSelectedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorePromoSelectedService],
    }).compile();

    service = module.get<StorePromoSelectedService>(StorePromoSelectedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
