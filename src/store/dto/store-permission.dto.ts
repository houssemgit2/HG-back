import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsInt, IsString } from 'class-validator';

export class StorePermissionDto {
  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // store_cip: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public resource: string;
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  public allow: number;
}
