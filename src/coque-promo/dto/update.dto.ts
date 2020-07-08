import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PeriodsDto } from './periods.dto';
import { ClusterIdDto } from './clusters.dto';

export class UpdateCoqueDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    required: false,
    type: PeriodsDto,
    isArray: true,
    example: [{ month: 5, year: 2020 }],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @Type(() => PeriodsDto)
  periods: PeriodsDto[];

  @ApiProperty({
    required: false,
    type: ClusterIdDto,
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    example: [{ cluster_id: 5 }],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClusterIdDto)
  clusters: ClusterIdDto[];

  @ApiProperty({
    required: false,
    type: 'string',
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    example: ['file 1 name', 'file 2 name'],
  })
  @IsArray()
  @IsNotEmpty()
  filesName: string[];
  @ApiProperty({
    required: false,
    type: 'string',
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    example: [12, 10],
  })
  @IsArray()
  @IsNotEmpty()
  filesToRemove: number[];
}
