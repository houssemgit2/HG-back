import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
export class EligibilityFrancoDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  value: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  eligibility_franco_type_id: number;
}
