import { Module } from '@nestjs/common';
import { SelectController } from './select.controller';
import { SelectService } from './select.service';
import { Product } from '../entities/Product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Gamme } from '../entities/Gamme';
import { Laboratory } from '../entities/Laboratory';
import { OperationType } from '../entities/OperationType';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Gamme, Laboratory, OperationType]),
    AuthModule,
  ],
  controllers: [SelectController],
  providers: [SelectService],
})
export class SelectModule {}
