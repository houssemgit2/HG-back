import { Promo } from './../entities/Promo';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoController } from './promo.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PromoService } from './promo.service';
import { PromoRepository } from './promo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PromoRepository]), AuthModule],
  controllers: [PromoController],
  providers: [PromoService],
})
export class PromoModule {}
