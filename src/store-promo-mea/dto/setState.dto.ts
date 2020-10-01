import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateIf,
} from 'class-validator';

import { PROMO_STATE, PROMO_STATE_ID } from '../../common/enum/enum-types';
export class SetStateDto {
  @ApiProperty({
    required: true,
    enum: PROMO_STATE,
  })
  @IsEnum(PROMO_STATE)
  @IsNotEmpty()
  @ValidateIf(o => !o.state_id)
  public state: PROMO_STATE;
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @ValidateIf(o => !o.state)
  public state_id: number;

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
  @ValidateIf(
    o =>
      (o.state === PROMO_STATE.REJECTED ||
        o.state_id === PROMO_STATE_ID.REJECTED) &&
      !o.reason_id,
  )
  public reason: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @ValidateIf(
    o =>
      (o.state === PROMO_STATE.REJECTED ||
        o.state_id === PROMO_STATE_ID.REJECTED) &&
      !o.reason,
  )
  public reason_id: number;
}
