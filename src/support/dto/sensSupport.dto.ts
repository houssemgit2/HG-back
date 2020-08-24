import { ApiProperty } from '@nestjs/swagger';
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
  @IsNotEmpty()
  @IsNumber()
  phone_num: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contact: string;
}
