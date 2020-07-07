import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreRepository } from './store.repository';

import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../auth/user.repository';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { StorePermissionRepository } from '../access-permissions/access-permissions.repository';
import { StorePromoMeaRepository } from '../store-promo-mea/store-promo-mea.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreRepository,
      UserRepository,
      StorePermissionRepository,
      StorePromoMeaRepository,
    ]),
    AuthModule,
    NestEmitterModule.forRoot(new EventEmitter()),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
