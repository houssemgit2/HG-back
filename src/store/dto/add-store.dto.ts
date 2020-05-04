import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddStoreDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cip: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  clu_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  descr: string;
}
