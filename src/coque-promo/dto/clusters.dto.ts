import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClusterIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cluster_id: number;
}
