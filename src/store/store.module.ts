import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreRepository } from './store.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreRepository, UserRepository]),
    AuthModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
