import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
export class EligibilityVolumeDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  value_min: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  value_max: number;
}
