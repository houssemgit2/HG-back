import { Promo } from './../../entities/Promo';
import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsDate,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArrayOfObject } from '../validator/arrayValidator';

export class SaveSelectedDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  month: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  year: number;

  @ApiProperty({ isArray: true, type: Array })
  @IsArrayOfObject({
    message: 'promos must be an array of promos',
  })
  public promos: any[];
}
