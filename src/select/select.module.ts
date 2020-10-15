import { Module } from '@nestjs/common';
import { SelectController } from './select.controller';
import { SelectService } from './select.service';
import { Product } from '../entities/Product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Gamme } from '../entities/Gamme';
import { Laboratory } from '../entities/Laboratory';
import { OperationType } from '../entities/OperationType';
import { AchatAdvantageDiscountType } from '../entities/AchatAdvantageDiscountType';
import { AchatSubAdvantageDiscountType } from '../entities/AchatSubAdvantageDiscountType';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Gamme,
      Laboratory,
      OperationType,
      AchatAdvantageDiscountType,
      AchatSubAdvantageDiscountType,
      AchatSubAdvantageDiscountType,
    ]),
    AuthModule,
  ],
  controllers: [SelectController],
  providers: [SelectService],
  exports: [SelectService],
})
export class SelectModule {}
