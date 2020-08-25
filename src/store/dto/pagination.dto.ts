import {
  IsOptional,
  IsNumberString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class PaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ groups: ['withPagination'] })
  @IsOptional({ always: false })
  perPage?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ groups: ['withPagination'] })
  @IsOptional({ always: false })
  page?: number;
}
