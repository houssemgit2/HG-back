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

export class GetPromoDto {
  @ApiProperty({ required: false })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ required: false })
  @Type(() => String)
  clusterId: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  laboratoryId: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gammeId: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  promoConcernTypeId: number;

  @ApiProperty({ required: false })
  @Type(() => String)
  promoTypeId: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  perPage: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  page: number;
}
