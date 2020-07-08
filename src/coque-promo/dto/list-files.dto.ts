import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class GetFilesDto {
  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  status?: boolean;
  @ApiProperty({
    required: false,
    type: 'number',
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
  })
  idsList?: number[];
}
