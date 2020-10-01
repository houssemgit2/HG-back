import { ApiProperty } from '@nestjs/swagger';

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
}
