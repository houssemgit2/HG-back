/* eslint-disable @typescript-eslint/camelcase */
import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, IsArray, IsJSON } from 'class-validator';

import { Type } from 'class-transformer';

import { ClusterIdDto } from './clusters.dto';
import { PeriodsDto } from './periods.dto';

export class CreateCoqueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    type: PeriodsDto,
    isArray: true,
    example: [{ month: 5, year: 2020 }],
  })
  // @IsArray()
  @IsNotEmpty()
  // @ValidateNested({ each: true, always: true })
  @Type(() => PeriodsDto)
  periods: PeriodsDto[];

  @ApiProperty({
    required: true,
    type: ClusterIdDto,
    isArray: true,
    example: [{ cluster_id: 5 }],
  })
  // @IsArray()
  @IsNotEmpty()
  // @ValidateNested({ each: true })
  @IsJSON()
  @Type(() => ClusterIdDto)
  clusters: ClusterIdDto[];

  @ApiProperty({
    required: true,
    type: String,
    isArray: true,
    example: ['file 1 name', 'file 2 name'],
  })
  @IsArray()
  @IsNotEmpty()
  filesName: string[];
}
