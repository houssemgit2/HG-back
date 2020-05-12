import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreRepository } from './store.repository';

import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/user.repository';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreRepository, UserRepository]),
    AuthModule,
    NestEmitterModule.forRoot(new EventEmitter()),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
