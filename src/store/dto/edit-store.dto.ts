import { IsNotEmpty, IsNumber, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class EditStoreDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  cip?: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsOptional()
  clu_id?: number;

  @ApiProperty({ required: true })
  @MaxLength(255)
  @IsOptional()
  descr?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  owner_id?: number;
}
