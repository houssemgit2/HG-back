import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { Gamme } from '../../entities/Gamme';
import { Laboratory } from '../../entities/Laboratory';

export class GetGammeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsExist(
    { message: 'brand not exist' },
    { entityName: 'Gamme', entity: Gamme, key: 'id' },
    false,
  )
  brand_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsExist(
    { message: 'laboratory not exist' },
    { entityName: 'Laboratory', entity: Laboratory, key: 'id' },
    false,
  )
  laboratory_id: number;
}
