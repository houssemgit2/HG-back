import { Module } from '@nestjs/common';
import { RejectionReasonService } from './rejection-reason.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RejectionReasonRepository } from './rejection-reason.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RejectionReasonRepository]), AuthModule],
  providers: [RejectionReasonService],
  exports: [RejectionReasonService],
})
export class RejectionReasonModule {}
