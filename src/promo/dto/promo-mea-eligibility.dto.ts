import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class EligibilityMinimumDetailsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity_min: number;
  @ApiProperty()
  @IsNumber()
  @Type(() => String)
  @IsNotEmpty()
  comment: string;
}
