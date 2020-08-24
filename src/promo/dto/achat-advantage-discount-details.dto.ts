import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EuroAchatDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty({ groups: ['unity-discount', 'discount'] })
  @IsOptional({ groups: ['unity'] })
  @IsNumber()
  @Type(() => Number)
  achat_advantage_sub_discount_type_id: number;

  @ApiProperty()
  @IsNotEmpty({ groups: ['unity-discount', 'unity'] })
  @IsOptional({ groups: ['discount'] })
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
// export class AchatAdvantageDiscountDetailsDto extends EuroAchatDiscountDto
//  PerCentAchatDiscountDto  PerUnitAchatDiscountDto { }
