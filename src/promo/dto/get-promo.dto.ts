import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsDate,
  IsString,
  IsBoolean,
  ValidateIf,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class GetPromoDto extends PaginationDto {
  @ApiProperty({ required: false })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ required: false, isArray: true, type: Number })
  @Type(() => Number)
  clusterId: number;

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
}
