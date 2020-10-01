import { ApiProperty } from '@nestjs/swagger';

import {
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { IsNumberString } from 'class-validator';

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
  public active: boolean; // TODO fix it it's alwys true
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public lab: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public circuit_vers: string;

  end_date?: string;
  start_date?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  store_id?: number;
}
