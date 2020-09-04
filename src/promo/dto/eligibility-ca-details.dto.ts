import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EligibilityDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  equal_condition_type_id: number;

  @ApiProperty()
  @IsNotEmpty({ groups: ['between', 'greaterThan'] })
  @IsOptional({ groups: ['lessThan'] })
  @Type(() => Number)
  value_min: number;

  @ApiProperty()
  @IsNotEmpty({ groups: ['between', 'lessThan'] })
  @IsOptional({ groups: ['greaterThan'] })
  @Type(() => Number)
  value_max: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  comment: string;
}
