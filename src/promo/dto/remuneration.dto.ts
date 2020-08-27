import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QuantityRemunerationFixedDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  emplacement_id: number;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  comment: string;
}
export class RemunerationUnitProductDetailsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  eligibility_ca_range_type_id: number;
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  value: number;
}
export class RemunerationCaAnnualDetailsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  remuneration_ca_annual_target_type_id: number;
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  remuneration_ca_annual_plate_type_id: number;
}
