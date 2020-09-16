import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmpty,
} from 'class-validator';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { Gamme } from '../../entities/Gamme';
import { IsNumberString, IsInt } from 'class-validator';

export class GetProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ean: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  // @IsExist(
  //   { message: 'Gamme not exist' },
  //   { entityName: 'Gamme', entity: Gamme, key: 'id' },
  //   false,
  // )
  gamme_id: number;
}
