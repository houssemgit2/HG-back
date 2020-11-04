import { ApiProperty } from '@nestjs/swagger';

import { Type, Transform } from 'class-transformer';

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
  @Type(() => Number)
  promoTypeId: number;

  @ApiProperty({ required: false })
  @Transform(value => JSON.parse(value))
  include_av_cli: boolean;
  @ApiProperty({ required: false })
  @Type(() => String)
  type_off: string;

  @ApiProperty({ required: false })
  // @Type(() => Boolean)
  @Transform(value => JSON.parse(value))
  toDownloadPdf: boolean;

  @ApiProperty({ required: false })
  // @Type(() => Boolean)
  @Transform(value => JSON.parse(value))
  csv = false;
  @ApiProperty({ required: false })
  // @Type(() => Boolean)
  @Transform(value => JSON.parse(value))
  for_calendar = false;
}
