import { Test, TestingModule } from '@nestjs/testing';
import { LeafletService } from './leaflet.service';

describe('LeafletService', () => {
  let service: LeafletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeafletService],
    }).compile();

    service = module.get<LeafletService>(LeafletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
