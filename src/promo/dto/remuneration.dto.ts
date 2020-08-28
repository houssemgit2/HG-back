import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { EligibilityDetailsDto } from './eligibility-ca-details.dto';

export class QuantityRemunerationFixedDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  emplacement_type_id: number;

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
export class RemunerationFixedDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_emplacement: boolean;

  @ApiProperty({
    isArray: true,
    type: QuantityRemunerationFixedDto,
  })
  @IsArray()
  @ValidateIf(o => o.has_emplacement)
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @Type(() => QuantityRemunerationFixedDto)
  data_emplacement: QuantityRemunerationFixedDto[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_quantity: boolean;

  @ApiProperty({
    isArray: true,
    type: EligibilityDetailsDto,
  })
  @ValidateIf(o => o.has_quantity)
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @Type(() => EligibilityDetailsDto)
  data_quantity: EligibilityDetailsDto[];
}
