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
import { PromoOperationType } from '../entities/PromoType';
import { PromoCluster } from '../entities/PromoCluster';
import { PromoAchat } from '../entities/PromoAchat';
import { PromoMea } from '../entities/PromoMea';
import { PromoMeaEmplacement } from '../entities/PromoMeaEmplacement';
import { PromoConso } from '../entities/PromoConso';
import { StorePromoMea } from '../entities/StorePromoMea';
import { PromoMeaDocumentProvide } from '../entities/PromoMeaDocumentProvide';
import { PdfCalendarGeneratorModule } from '../../libs/pdf-calendar-generator/src/pdf-calendar-generator.module';
import { SelectModule } from '../select/select.module';

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
    SelectModule
  ],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
