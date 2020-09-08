import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { AchatAdvantageDiscountType } from '../../entities/AchatAdvantageDiscountType';
import {
  PerCentAchatDiscountDto,
  EuroAchatDiscountDto,
  FreeUnitAchatDiscountDto,
} from './achat-advantage-discount-details.dto';
export class AchatAdvantageDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsExist(
    { message: 'advantage_discount_type_id not exist' },
    {
      entityName: 'AchatAdvantageDiscountType',
      entity: AchatAdvantageDiscountType,
      key: 'id',
    },
    false,
  )
  @IsNumber()
  achat_advantage_discount_type_id: number;

  @ApiProperty({
    type: EuroAchatDiscountDto,
    example: {
      achat_advantage_sub_discount_type_id: 1,
      value: 2,
    },
  })
  @IsNotEmpty({ groups: ['euro'] })
  @ValidateNested({ groups: ['euro'] })
  @IsOptional({ groups: ['freeUnit', 'percentage'] })
  @Type(() => EuroAchatDiscountDto)
  euro_details: EuroAchatDiscountDto;

  @ApiProperty({
    type: PerCentAchatDiscountDto,
    isArray: true,
    example: [
      {
        unity: true,
        discount: false,
        achat_advantage_sub_discount_type_id: 1,
        variegated: true,
        comment: 'comment',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty({ groups: ['percentage'] })
  @ValidateNested({ each: true, groups: ['percentage'] })
  @IsOptional({ groups: ['freeUnit', 'euro'] })
  @Type(() => PerCentAchatDiscountDto)
  percentage_details: PerCentAchatDiscountDto[];

  @ApiProperty({
    type: FreeUnitAchatDiscountDto,
    example: {
      ordered_unity: 2,
      free_unity: 1,
      comment: 'text',
    },
  })
  @IsNotEmpty({ groups: ['freeUnit'] })
  // @IsOptional({ groups: ['percentage', 'euro'] })
  @IsOptional({ groups: ['percentage', 'euro'] })
  @ValidateNested({ each: true, groups: ['freeUnit'] })
  @Type(() => FreeUnitAchatDiscountDto)
  free_unit_details: FreeUnitAchatDiscountDto;
}
