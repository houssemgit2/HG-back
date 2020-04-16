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
  @Type(() => Number)
  offerAvantageClient: number;

  @ApiProperty({ required: false })
  @Type(() => String)
  clusters: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  type: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  perPage: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  page: number;
}
