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

export class GetLeafletPeriodDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  perPage: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  page: number;
}
