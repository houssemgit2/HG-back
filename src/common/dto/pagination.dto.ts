import { IsOptional, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class PaginationDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNotEmpty()
  @ValidateIf(o => o.page)
  perPage?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNotEmpty()
  @ValidateIf(o => o.perPage)
  page?: number;
}
