import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class ActiveToggleDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsBoolean()
  public active: boolean;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  public store_id: number;
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  public reason: string;
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  public reason_id: number;
}
