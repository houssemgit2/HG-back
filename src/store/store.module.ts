import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreRepository } from './store.repository';

import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/user.repository';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import { StorePermissionRepository } from 'src/access-permissions/access-permissions.repository';
import { StorePromoMeaRepository } from 'src/store-promo-mea/store-promo-mea.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreRepository,
      UserRepository,
      StorePermissionRepository,
      StorePromoMeaRepository
    ]),
    AuthModule,
    NestEmitterModule.forRoot(new EventEmitter()),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
