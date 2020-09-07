import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EuroAchatDiscountDto {
  @ApiProperty()
  @IsNotEmpty({ groups: ['euro'] })
  @Type(() => Number)
  achat_advantage_sub_discount_type_id: number;
  @ApiProperty()
  @IsNotEmpty({ groups: ['euro'] })
  @Type(() => Number)
  value: number;
}
export class PerCentAchatDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  unity: boolean;
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  discount: boolean;

  @ApiProperty()
  @ValidateIf(o => o.discount === true)
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  achat_advantage_sub_discount_type_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf(o => o.unity === true)
  @IsBoolean()
  @Type(() => Boolean)
  variegated: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  comment: string;
}
export class FreeUnitAchatDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  ordered_unity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  free_unity: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  comment: string;
}
