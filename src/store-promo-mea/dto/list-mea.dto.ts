import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { IsNumberString, IsNumber } from 'class-validator';

import { PROMO_STATE } from 'src/common/enum/enum-types';

import { Type } from 'class-transformer';

import { PaginationDto } from '../../common/dto/pagination.dto';

import { DatesMonthYearDto } from './datesList.dto';

export class ListMeaDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  public month: number;
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  public year: number;
  @ApiProperty({
    required: false,
    type: DatesMonthYearDto,
    isArray: true,
    example: [{ month: 5, year: 2020 }],
  })
  public dates_list: DatesMonthYearDto[];

  @ApiProperty({ required: false })
  @IsEnum(PROMO_STATE, {
    message: `state must be in ${PROMO_STATE}`,
  })
  @IsOptional()
  public state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clusters: string;

  @ApiProperty({ required: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public active: boolean; // TODO fix it it's alwys true
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public lab: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public circuit_vers: string;
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  public circuit_vers_id: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ required: false, type: Boolean })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  v2 = false;

  end_date?: string;
  start_date?: string;
}
