import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatesMonthYearDto } from './datesList.dto';
import { IsNumberString } from 'class-validator';
import { PaginationDto } from '../../store/dto/pagination.dto';

const PromoMeaStateEnum = [
  'CONFIRMED',
  'REJECTED',
  'TO_JUSTIFY',
  'PENDING',
  'NOT_JUSTIFIED',
  'OPERATION_REFUSED',
  'UNJUSTIFIED',
];
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
  @IsEnum(PromoMeaStateEnum, {
    message: `state must be in ${PromoMeaStateEnum}`,
  })
  @IsOptional()
  public state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clusters: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public active: boolean;
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
  // @IsValidStoreId({
  //   message: 'store_id is not allowed for this user, or missed store_id',
  // })
  store_id?: number;
}
