import { Test, TestingModule } from '@nestjs/testing';
import { AccessPermissionsService } from './access-permissions.service';

describe('AccessPermissionsService', () => {
  let service: AccessPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessPermissionsService],
    }).compile();

    service = module.get<AccessPermissionsService>(AccessPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
