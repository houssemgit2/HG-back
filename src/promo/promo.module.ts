import { PdfPromoGeneratorModule } from '@app/pdf-promo-generator';
import { PdfCalendarGeneratorModule } from '@app/pdf-calendar-generator';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { RejectionReasonModule } from 'src/rejection-reason/rejection-reason.module';
import { MeaUploadModule } from 'src/mea-upload/mea-upload.module';

import { PromoAchat } from '../entities/PromoAchat';
import { PromoCluster } from '../entities/PromoCluster';
import { PromoConso } from '../entities/PromoConso';
import { PromoMea } from '../entities/PromoMea';
import { PromoMeaDocumentProvide } from '../entities/PromoMeaDocumentProvide';
import { PromoMeaEmplacement } from '../entities/PromoMeaEmplacement';
import { PromoOperationType } from '../entities/PromoType';
import { StorePromoMea } from '../entities/StorePromoMea';
import { SelectModule } from '../select/select.module';
import { StorePromoMeaModule } from '../store-promo-mea/store-promo-mea.module';
import { StorePromoSelectedModule } from './../store-promo-selected/store-promo-selected.module';

import { PromoController } from './promo.controller';
import { PromoRepository } from './promo.repository';
import { PromoService } from './promo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PromoRepository,
      PromoOperationType,
      PromoCluster,
      PromoAchat,
      PromoMea,
      PromoMeaEmplacement,
      PromoConso,
      StorePromoMea,
      PromoMeaDocumentProvide,
    ]),
    AuthModule,
    PdfPromoGeneratorModule,
    PdfCalendarGeneratorModule,
    RejectionReasonModule,
    StorePromoSelectedModule,
    StorePromoMeaModule,
    MeaUploadModule,
    SelectModule,
  ],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
