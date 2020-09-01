import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class DiscountDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsString()
  // @Type(() => String)
  // sub_discount_name: string;
}
