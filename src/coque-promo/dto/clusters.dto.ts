import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsNotEmpty } from 'class-validator';

export class ClusterIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  cluster_id: number;
}
