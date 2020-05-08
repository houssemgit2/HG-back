import { IsNumber, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetAccessPermissionDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  public resource_id: number;
}
