import { Module } from '@nestjs/common';
import { LefletPeriodService } from './leflet-period.service';
import { LefletPeriodController } from './leflet-period.controller';
import { LeafletPeriod } from './../entities/LeafletPeriod';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LeafletPeriod])],
  providers: [LefletPeriodService],
  controllers: [LefletPeriodController],
})
export class LefletPeriodModule {}
