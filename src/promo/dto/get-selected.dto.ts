import { Promo } from './../../entities/Promo';
import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsDate,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetSelectedDto {
  @ApiProperty()
  @Type(() => Number)
  month: number;

  @ApiProperty()
  @Type(() => Number)
  year: number;

  @ApiProperty({ required: false })
  @Type(() => String)
  includePromoDetails: string;
}
