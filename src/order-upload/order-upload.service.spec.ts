import { Test, TestingModule } from '@nestjs/testing';
import { OrderUploadService } from './order-upload.service';

describe('OrderUploadService', () => {
  let service: OrderUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderUploadService],
    }).compile();

    service = module.get<OrderUploadService>(OrderUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
