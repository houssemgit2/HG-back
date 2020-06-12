import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    type: Number,
  })
  @IsOptional()
  @IsString()
  public reason: string;
}
