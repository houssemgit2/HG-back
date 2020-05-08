import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class StorePermissionDto {
  // @ApiProperty()
  // @IsNumber()
  // @IsNotEmpty()
  // store_cip: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public resource: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public allow: number;
}
