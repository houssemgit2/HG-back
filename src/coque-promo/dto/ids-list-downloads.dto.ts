import { IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanNumber } from '../../common/decorators/isBooleanNumber.decorator';
export class DownloadFilterDto {
  @ApiProperty({
    required: false,
    type: 'number',
    isArray: true,
    example: [12, 45],
  })
  @IsOptional()
  @IsArray()
  idsList: string[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBooleanNumber()
  status: boolean;
}
