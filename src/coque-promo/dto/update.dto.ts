import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PeriodsDto } from './periods.dto';
import { ClusterIdDto } from './clusters.dto';
import { IsBooleanNumber } from 'src/common/decorators/isBooleanNumber.decorator';

export class UpdateCoqueDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanNumber({ message: 'must be boolean/ 1 or 0' })
  status: boolean;

  @ApiProperty({
    required: false,
    type: PeriodsDto,
    isArray: true,
    example: [{ month: 5, year: 2020 }],
  })
  @IsArray()
  @IsOptional()
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
  @IsOptional()
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
  @IsOptional()
  @IsArray()
  filesName: string[];

  @ApiProperty({
    required: false,
    type: 'string',
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    example: [12, 10],
  })
  @IsArray()
  @IsOptional()
  filesToRemove: number[];
}
