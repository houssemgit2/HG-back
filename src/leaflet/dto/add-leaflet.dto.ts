import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddLeafletDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  periodId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(64)
  lab: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(64)
  libelle: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(64)
  gamme: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  contenance: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(50)
  condEl: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(25)
  unit: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qteLot: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  urlOrder: string;
}
