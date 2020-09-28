import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PROMO_STATE } from '../../config/enum-types';
export class SetStateDto {
  @ApiProperty({
    required: true,
    enum: PROMO_STATE,
  })
  @IsEnum(PROMO_STATE)
  @IsNotEmpty()
  public state: PROMO_STATE;
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  public store_id: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.state === PROMO_STATE.REJECTED && !o.reason_id)
  public reason: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @ValidateIf(o => o.state === PROMO_STATE.REJECTED && !o.reason)
  public reason_id: number;
}
