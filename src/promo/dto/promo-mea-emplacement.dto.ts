import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PromoMeaEmplacementDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  public emplacement_type_id: number; //  validation isnUmber

  @ApiProperty()
  @Type(() => String)
  public details: string;
}
