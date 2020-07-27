import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsBooleanNumber } from 'src/common/decorators/isBooleanNumber.decorator';

export class GetFilesDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBooleanNumber({ message: 'must be boolean/ 1 or 0' })
  status?: boolean;
  @ApiProperty({
    required: false,
    type: 'number',
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
  })
  idsList?: number[];
}
