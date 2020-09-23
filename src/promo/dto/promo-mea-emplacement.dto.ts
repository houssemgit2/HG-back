import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PromoMeaEmplacementDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public emplacement_type_id: number; // TODO  validation isnUmber must be fixed

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  public details: string;
}
