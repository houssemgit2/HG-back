import { Test, TestingModule } from '@nestjs/testing';
import { AccessPermissionsController } from './access-permissions.controller';

describe('AccessPermissions Controller', () => {
  let controller: AccessPermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessPermissionsController],
    }).compile();

    controller = module.get<AccessPermissionsController>(AccessPermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
