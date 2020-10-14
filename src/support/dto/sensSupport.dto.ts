import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class SupportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  concerned_module: string;
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  phone_num: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contact: string;
}
