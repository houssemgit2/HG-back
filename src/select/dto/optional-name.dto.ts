import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class OptionalNameDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string;
}
