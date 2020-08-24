import { ApiProperty } from '@nestjs/swagger';

export class SavePromoTypeDto {
  @ApiProperty({
    required: true,
    type: Number,
    isArray: true,
    example: [1, 3],
  })
  public type_ids: number[];
}
