import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateAccessPermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @IsEnum()
  public resource: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public allow: number;
}
