import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddStoreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cip: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cluster_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
