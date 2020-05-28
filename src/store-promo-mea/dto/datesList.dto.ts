import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DatesMonthYearDto {
  @ApiProperty({
    required: true,
    type: Number,
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  public month: number;

  @ApiProperty({
    required: true,
    type: Number,
    example: 2020,
  })
  @IsNotEmpty()
  @IsNumber()
  public year: number;
}
