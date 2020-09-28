import { IsNotEmpty, IsNumber, IsEnum, ValidateIf } from 'class-validator';
import { PROMO_STATE } from 'src/config/enum-types';

export class ImportedExcelPromosJSon {
  @IsNotEmpty()
  @IsNumber()
  promoId: number;

  @IsNotEmpty()
  @IsNumber()
  storeId: number;
  @IsEnum([PROMO_STATE.REJECTED, PROMO_STATE.CONFIRMED, undefined])
  state: PROMO_STATE.REJECTED | PROMO_STATE.CONFIRMED | undefined;

  @ValidateIf(o => o.state === PROMO_STATE.REJECTED)
  @IsNotEmpty()
  rejectionReason?: string;
}
