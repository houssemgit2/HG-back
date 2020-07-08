import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PeriodsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  year: number;
}
