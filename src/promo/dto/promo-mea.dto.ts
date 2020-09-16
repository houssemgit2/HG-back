import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
} from 'class-validator';
import { EligibilityDetailsDto } from './eligibility-ca-details.dto';
import { EligibilityMinimumDetailsDto } from './promo-mea-eligibility.dto';
import {
  RemunerationCaAnnualDetailsDto,
  RemunerationFixedDetailsDto,
} from './remuneration.dto';
import { RemunerationUnitProductDetailsDto } from './remuneration.dto';
import { PromoMeaEmplacementDto } from './promo-mea-emplacement.dto';

export class PromoMeaDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_eligibility_minimum_order: boolean;

  @ApiProperty({
    type: EligibilityMinimumDetailsDto,
    example: {
      quantity_min: 21,
      comment: 'string',
    },
  })
  @ValidateIf(o => o.has_eligibility_minimum_order)
  @IsNotEmpty()
  @Type(() => EligibilityMinimumDetailsDto)
  eligibility_minimum_details: EligibilityMinimumDetailsDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_eligibility_ca_range: boolean;

  @ApiProperty({
    isArray: true,
    type: EligibilityDetailsDto,
    example: [
      {
        equal_condition_type_id: 1,
        value_min: 100,
        value_max: 250,
        comment: 'text',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @ValidateIf(o => o.has_eligibility_ca_range)
  @Type(() => EligibilityDetailsDto)
  eligibility_ca_range_details: EligibilityDetailsDto[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_eligibility_other: boolean;

  @ApiProperty()
  @ValidateIf(o => o.hasEligibilityOther)
  @IsNotEmpty()
  @Type(() => String)
  eligibility_other_details: string;

  @ApiProperty({
    isArray: true,
    type: EligibilityDetailsDto,
    example: [
      {
        emplacement_type_id: 2,
        details: 'string',
      },
    ],
  })
  @Type(() => PromoMeaEmplacementDto)
  promo_mea_emplacements: PromoMeaEmplacementDto[];

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  emplacement_plv_labo: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_remuneration_unit_product: boolean;

  @ApiProperty({
    isArray: false,
    type: RemunerationUnitProductDetailsDto,
    example: { eligibility_ca_range_type_id: 1, value: 100 },
  })
  @ValidateIf(o => o.has_remuneration_unit_product)
  @ValidateNested({ each: true, always: true })
  @IsNotEmpty()
  @Type(() => RemunerationUnitProductDetailsDto)
  remuneration_unit_product_details: RemunerationUnitProductDetailsDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_remuneration_fixed: boolean;

  @ApiProperty({
    type: RemunerationFixedDetailsDto,
    example: {
      has_emplacement: true,
      data_emplacement: [{ emplacement_type_id: 1, comment: 'test' }],
      has_quantity: true,
      data_quantity: [
        {
          equal_condition_type_id: 1,
          value_min: 100,
          value_max: 250,
          comment: 'text',
        },
      ],
    },
  })
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @ValidateIf(o => o.has_remuneration_fixed)
  @Type(() => RemunerationFixedDetailsDto)
  remuneration_fixed_details: RemunerationFixedDetailsDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_remuneration_ca_annual: boolean;

  @ApiProperty({
    isArray: false,
    type: RemunerationCaAnnualDetailsDto,
    example: {
      remuneration_ca_annual_target_type_id: 1,
      remuneration_ca_annual_plate_type_id: 100,
    },
  })
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @ValidateIf(o => o.has_remuneration_ca_annual)
  @Type(() => RemunerationCaAnnualDetailsDto)
  remuneration_ca_annual_details: RemunerationCaAnnualDetailsDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  has_remuneration_other: boolean;

  @ApiProperty()
  @ValidateIf(o => o.has_remuneration_other)
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  remuneration_other_details: string;

  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  repayment_circuit_type_id: number;

  @ApiProperty({
    isArray: true,
    type: Number,
    example: ['1', '2'],
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  document_provide_types: number[];

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  has_promo_conso_linked: boolean;
  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  has_promo_achat_linked: boolean;
}

// remuneration_unit_product_details
// remuneration_fixed_details_quantity
// remuneration_fixed_details_emplacement
// remuneration_ca_annual_details
