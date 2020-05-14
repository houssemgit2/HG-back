import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAccessPermissionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  // @IsEnum()
  public resource_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public store_cip: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public allow: number;
}
