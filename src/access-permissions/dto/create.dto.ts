import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAccessPermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public resource: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public store_cip: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public allow: number;
}
