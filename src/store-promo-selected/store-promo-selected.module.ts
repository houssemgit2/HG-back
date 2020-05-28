import { StorePromoSelected } from './../entities/StorePromoSelected';
import { Module } from '@nestjs/common';
import { StorePromoSelectedService } from './store-promo-selected.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StorePromoSelected])],
  providers: [StorePromoSelectedService],
  exports: [StorePromoSelectedService],
})
export class StorePromoSelectedModule {}
