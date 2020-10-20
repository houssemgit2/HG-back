import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsString,
} from 'class-validator';

import { IsNotEmptyArray } from '../validator/empty-array.validator';

class PrmDetDto {
  @ApiProperty()
  @IsNumber()
  contenance: number;

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsString()
  lab: string; //'A-DERMA';

  @ApiProperty()
  @IsString()
  libelle: string; //'Phys-AC GLOBAL Soin';

  @ApiProperty()
  @IsString()
  mesUnit: string; // 'UNITE';

  @ApiProperty()
  @IsNumber()
  oldPrice: number;

  @ApiProperty()
  @IsNumber()
  physicalLot: number;
  @ApiProperty()
  @IsString()
  prmMention2: string; // '3';
}
class PdfPromoDto {
  @ApiProperty()
  @IsNotEmpty()
  copies: number;

  @ApiProperty()
  @IsNotEmpty()
  format: string;

  @ApiProperty()
  @IsNotEmpty()
  orientation: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ always: true })
  @Type(() => PrmDetDto)
  prmDet: PrmDetDto;

  @ApiProperty()
  @IsNotEmpty()
  prmEndDate: string; //'31-10-2020';
  @ApiProperty()
  @IsNotEmpty()
  prmMention: string; // "2"

  @ApiProperty()
  @IsNotEmpty()
  prmStartDate: string; // '01-10-2020';

  @ApiProperty()
  @IsNotEmpty()
  type: string; //'Remise_en_pour_sur_1_produit';
}

export class GeneratePdfPromosDto {
  @IsNotEmptyArray({ message: 'promos array items must be not null' })
  promos: PdfPromoDto[];
}
