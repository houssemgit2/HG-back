import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddLeafletPeriodDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNotEmpty()
  calendarPeriod: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNotEmpty()
  year: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsNotEmpty()
  enabled: number;
}
