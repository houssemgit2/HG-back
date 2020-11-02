import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsArray } from 'class-validator';

export class SavePromoTypeDto {
  @ApiProperty({
    required: true,
    type: Number,
    isArray: true,
    example: [1, 3],
  })
  @IsArray()
  public type_ids: number[];
  @ApiProperty()
  @Type(() => Number)
  public promo_id: number;
}
