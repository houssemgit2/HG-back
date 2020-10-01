import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsString, IsOptional } from 'class-validator';
import { OptionalNameDto } from './optional-name.dto';
import { STATIC_TABLES } from '../../common/enum/enum-types';

const tableENum = STATIC_TABLES.map(item => item.name);
export class SelectStaticDto extends OptionalNameDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    required: true,
    example: ` 'ca_target' OR 'ca_plate' OR 'remuneration_fixed' OR 'remuneration_base',`,
    enumName: 'filed name',
    enum: tableENum,
  })
  @IsNotEmpty()
  @IsEnum(tableENum)
  field: string;

  targetEntity: any;
  entityName: string;
}
