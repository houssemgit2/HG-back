import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PromoService } from './promo.service';
import { PromoRepository } from './promo.repository';
import { PdfPromoGeneratorModule } from '@app/pdf-promo-generator';
import { RejectionReasonModule } from 'src/rejection-reason/rejection-reason.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromoRepository]),
    AuthModule,
    PdfPromoGeneratorModule,
    RejectionReasonModule,
  ],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
