import { Test, TestingModule } from '@nestjs/testing';
import { MeaUploadService } from './mea-upload.service';

describe('MeaUploadService', () => {
  let service: MeaUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeaUploadService],
    }).compile();

    service = module.get<MeaUploadService>(MeaUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
