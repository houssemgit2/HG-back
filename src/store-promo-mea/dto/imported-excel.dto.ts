import { IsNotEmpty, IsNumber, IsEnum, ValidateIf } from 'class-validator';

import { PROMO_STATE, PROMO_STATE_ID } from 'src/common/enum/enum-types';

export class ImportedExcelPromosJSon {
  @IsNotEmpty()
  @IsNumber()
  promoId: number;

  @IsNotEmpty()
  @IsNumber()
  @ValidateIf(o => !o.state)
  storeId: number;

  @IsNotEmpty()
  @IsEnum([PROMO_STATE.REJECTED, PROMO_STATE.CONFIRMED, undefined])
  @ValidateIf(o => !o.stateId)
  state: PROMO_STATE.REJECTED | PROMO_STATE.CONFIRMED | undefined;

  @ValidateIf(
    o =>
      o.state === PROMO_STATE.REJECTED || o.stateId === PROMO_STATE_ID.REJECTED,
  )
  @IsNotEmpty()
  rejectionReason?: string;
}
