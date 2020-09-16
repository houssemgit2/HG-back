import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetGammeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => String)
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  // @IsExist(
  //   { message: 'brand not exist' },
  //   { entityName: 'Gamme', entity: Gamme, key: 'id' },
  //   false,
  // )
  brand_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  laboratory_id: number;
}
