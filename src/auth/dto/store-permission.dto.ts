import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

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
  @IsNumber()
  @IsNotEmpty()
  allow: number;
}
