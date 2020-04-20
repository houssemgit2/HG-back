import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetStoreDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  perPage: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  page: number;
}
