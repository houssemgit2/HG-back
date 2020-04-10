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
}
