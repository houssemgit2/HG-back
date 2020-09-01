import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsUserAlreadyExist } from '../../common/decorators/isUnique.validation';
import { Gamme } from '../../entities/Gamme';

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
  @IsUserAlreadyExist(
    { message: 'Gamme not exist' },
    { entityName: 'Gamme', entity: Gamme, key: 'id' },
    false,
  )
  brand_id: number;
}
