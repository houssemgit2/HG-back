import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsString, IsOptional } from 'class-validator';

import { IsBooleanNumber } from 'src/common/decorators/isBooleanNumber.decorator';

export class UpdateCoqueFileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  filesName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBooleanNumber({ message: 'must be boolean/ 1 or 0' })
  status: boolean;
}
