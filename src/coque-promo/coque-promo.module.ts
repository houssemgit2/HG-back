import { Module } from '@nestjs/common';
import { CoquePromoController } from './coque-promo.controller';
import { CoquePromoService } from './coque-promo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CoquePromoRepository } from './coque-promo.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoquePromoRepository,
    ]),
    AuthModule,
  ],

  controllers: [CoquePromoController],
  providers: [CoquePromoService],
})
export class CoquePromoModule {}
