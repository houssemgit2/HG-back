import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class AddLeafletDto {
  @ApiProperty()
  @Type(() => String)
  cond_el: string;

  @ApiProperty()
  @Type(() => Number)
  contenance: number;

  @ApiProperty()
  @Type(() => String)
  gamme: string;

  @ApiProperty()
  @Type(() => String)
  lab: string;

  @ApiProperty()
  @Type(() => String)
  libelle: string;

  @ApiProperty()
  @Type(() => String)
  period: string;

  @ApiProperty()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @Type(() => String)
  unit: string;

  @ApiProperty()
  @Type(() => Number)
  qte_lot: number;

  @ApiProperty()
  @Type(() => String)
  year: string;
}
