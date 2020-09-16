import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EuroAchatDiscountDto {
  @ApiProperty()
  @IsNotEmpty({ groups: ['euro'] })
  // @Type(() => Number)
  @IsNumber()
  achat_advantage_sub_discount_type_id: number;
  @ApiProperty()
  @IsNotEmpty({ groups: ['euro'] })
  // @Type(() => Number)
  @IsNumber()
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
  @Type(() => Number)
  @IsNumber()
  achat_advantage_sub_discount_type_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf(o => o.unity === true)
  @Type(() => Boolean)
  @IsBoolean()
  variegated: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  comment: string;
}
export class FreeUnitAchatDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ordered_unity: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  free_unity: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  comment: string;
}
