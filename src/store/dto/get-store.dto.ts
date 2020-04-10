import { IsNotEmpty, IsNumber, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetStoreDto {
  @ApiProperty({ required: false })
  @IsNumber()
  cip: number;

  @ApiProperty({ required: false })
  @IsNumber()
  cluster_id: number;

  @ApiProperty({ required: false })
  @MaxLength(255)
  name: string;
}
