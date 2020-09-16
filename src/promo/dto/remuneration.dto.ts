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
import { PromoMeaEmplacementDto } from './promo-mea-emplacement.dto';

export class RemunerationUnitProductDetailsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  eligibility_ca_range_type_id: number;
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
export class RemunerationCaAnnualDetailsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  remuneration_ca_annual_target_type_id: number;
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
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
    type: PromoMeaEmplacementDto,
  })
  @IsArray()
  @ValidateIf(o => o.has_emplacement)
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @Type(() => PromoMeaEmplacementDto)
  data_emplacement: PromoMeaEmplacementDto[];

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
