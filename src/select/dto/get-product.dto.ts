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
  @Type(() => String)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ean: number;

  @ApiProperty({ required: false })
  // @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsExist(
    { message: 'Gamme not exist' },
    { entityName: 'Gamme', entity: Gamme, key: 'id' },
    false,
  )
  gamme_id: number;
}
