import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

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
  @IsBoolean()
  @IsNotEmpty()
  public allow: boolean;
}
