import { Promo } from './../entities/Promo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { PromoRepository } from './promo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, PromoRepository])],
  controllers: [PromoController],
})
export class PromoModule {}
