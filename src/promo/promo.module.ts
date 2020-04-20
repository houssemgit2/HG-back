import { Promo } from './../entities/Promo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PromoService } from './promo.service';
import { PromoRepository } from './promo.repository';
import { PdfPromoGeneratorModule } from '@app/pdf-promo-generator';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromoRepository]),
    AuthModule,
    PdfPromoGeneratorModule,
  ],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
