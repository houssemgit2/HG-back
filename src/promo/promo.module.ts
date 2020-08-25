import { StorePromoSelectedModule } from './../store-promo-selected/store-promo-selected.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PromoService } from './promo.service';
import { PromoRepository } from './promo.repository';
import { PdfPromoGeneratorModule } from '@app/pdf-promo-generator';
import { RejectionReasonModule } from 'src/rejection-reason/rejection-reason.module';
import { StorePromoMeaModule } from '../store-promo-mea/store-promo-mea.module';
import { MeaUploadModule } from 'src/mea-upload/mea-upload.module';
import { PromoType } from '../entities/PromoType';
import { PromoCluster } from '../entities/PromoCluster';
import { PromoAchat } from '../entities/PromoAchat';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromoRepository,
      PromoType,
      PromoCluster,
      PromoAchat,
    ]),
    AuthModule,
    PdfPromoGeneratorModule,
    RejectionReasonModule,
    StorePromoSelectedModule,
    StorePromoMeaModule,
    MeaUploadModule,
  ],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
