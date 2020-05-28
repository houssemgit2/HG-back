import { Module } from '@nestjs/common';
import { LefletPeriodService } from './leflet-period.service';
import { LefletPeriodController } from './leflet-period.controller';
import { LeafletPeriod } from './../entities/LeafletPeriod';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LeafletPeriod]), AuthModule],
  providers: [LefletPeriodService],
  controllers: [LefletPeriodController],
  exports: [LefletPeriodService],
})
export class LefletPeriodModule {}
