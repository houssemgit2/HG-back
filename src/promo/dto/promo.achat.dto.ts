/* eslint-disable @typescript-eslint/camelcase */
import { EligibilityDetailsDto } from './eligibility-ca-details.dto';
import { EligibilityVolumeDto } from './eligibility-volume.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EligibilityFrancoDto } from './eligibility-franco.dto';
import { AchatAdvantageDiscountDto } from './achat-advantage-discount.dto';

export class PromoAchatDto {
  @ApiProperty({
    required: true,
    type: EligibilityDetailsDto,
    isArray: true,
    example: [
      {
        equal_condition_type_id: 1,
        value_min: 1,
        value_max: 2,
        comment: 'comment',
      },
    ],
  })
  @ValidateNested({ each: true, always: true })
  @Type(() => EligibilityDetailsDto)
  eligibility_ca_details: EligibilityDetailsDto[];

  @ApiProperty({
    required: true,
    type: EligibilityVolumeDto,
    isArray: true,
    example: [{ value_min: 100, value_max: 200 }],
  })
  @ValidateNested({ each: true, always: true })
  @Type(() => EligibilityVolumeDto)
  eligibility_volume: EligibilityVolumeDto[];

  @ApiProperty({
    required: true,
    type: EligibilityVolumeDto,
    isArray: false,
    example: { value: 200, eligibility_franco_type_id: 2 },
  })
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @Type(() => EligibilityFrancoDto)
  eligibility_franco: EligibilityFrancoDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  eligibility_other: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  eligibility_additional_information: string;

  @ApiProperty({
    required: true,
    type: AchatAdvantageDiscountDto,
    isArray: false,
    example: {
      achat_advantage_discount_type_id: 1,
      euro_details: {
        achat_advantage_sub_discount_type_id: 1,
        value: 2,
      },
      percentage_details: [
        {
          unity: true,
          discount: false,
          achat_advantage_sub_discount_type_id: 1,
          variegated: true,
          comment: 'comment',
        },
      ],
      free_unit_details: {
        ordered_unity: 2,
        free_unity: 1,
        comment: 'text',
      },
    },
  })
  @ValidateNested({ each: true, always: true })
  @Type(() => AchatAdvantageDiscountDto)
  achat_advantage_discount_details: AchatAdvantageDiscountDto;

  achat_advantage_discount_type_id?: number;
}
