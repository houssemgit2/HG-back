import { Module } from '@nestjs/common';
import { StorePromoMeaController } from './store-promo-mea.controller';
import { StorePromoMeaService } from './store-promo-mea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorePromoMeaRepository } from './store-promo-mea.repository';
import { AuthModule } from '../auth/auth.module';
import { RejectionReasonRepository } from '../rejection-reason/rejection-reason.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StorePromoMeaRepository,RejectionReasonRepository]), AuthModule],

  controllers: [StorePromoMeaController],
  exports: [StorePromoMeaService],
  providers: [StorePromoMeaService],
})
export class StorePromoMeaModule {}
