import { Type } from 'class-transformer';

import { IsNotEmpty, IsNumber, IsEnum, ValidateIf } from 'class-validator';

import { PROMO_STATE, PROMO_STATE_ID } from 'src/common/enum/enum-types';

export class ImportedExcelPromosJSon {
  @IsNotEmpty()
  @IsNumber()
  promoId: number;

  @IsNotEmpty()
  @IsNumber()
  storeId: number;

  @IsEnum([PROMO_STATE.REJECTED, PROMO_STATE.CONFIRMED, undefined])
  @ValidateIf(o => !o.stateId)
  state: PROMO_STATE.REJECTED | PROMO_STATE.CONFIRMED | undefined;

  @Type(() => Number)
  @ValidateIf(o => !o.state)
  stateId: number | undefined;

  @ValidateIf(
    o =>
      o.state === PROMO_STATE.REJECTED || o.stateId === PROMO_STATE_ID.REJECTED,
  )
  @IsNotEmpty()
  rejectionReason?: string;
}
