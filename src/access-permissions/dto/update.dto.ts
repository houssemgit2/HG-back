import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateAccessPermissionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  // @IsEnum()
  public resource_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public allow: number;
}
