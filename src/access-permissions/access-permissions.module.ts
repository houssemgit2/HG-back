import { Module } from '@nestjs/common';
import { AccessPermissionsController } from './access-permissions.controller';
import { AccessPermissionsService } from './access-permissions.service';
import { StorePermissionRepository } from './access-permissions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorePermissionRepository]),
    AuthModule,
  ],
  controllers: [AccessPermissionsController],
  providers: [AccessPermissionsService]
})
export class AccessPermissionsModule {}
