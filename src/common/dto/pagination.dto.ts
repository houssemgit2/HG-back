import { IsOptional, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class PaginationDto {
  @ApiProperty({ required: false })
  // @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf(o => o.page)
  // @IsNotEmpty({ groups: ['withPagination'] })
  // @IsOptional({ always: false })
  perPage?: number;

  @ApiProperty({ required: false })
  // @Type(() => Number)
  @IsNumber()
  // @IsNotEmpty({ groups: ['withPagination'] })
  // @IsOptional({ always: false })
  @IsNotEmpty()
  @ValidateIf(o => o.page)
  page?: number;
}
