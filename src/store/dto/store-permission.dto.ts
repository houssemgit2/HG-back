import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class StorePermissionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  store_cip: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  resource_id: number;
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  allow: boolean;
}
