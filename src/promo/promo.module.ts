import { Promo } from './../entities/Promo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { PromoRepository } from './promo.repository';
import { AuthModule } from 'src/auth/auth.module';
import { PromoService } from './promo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, PromoRepository]), AuthModule],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
