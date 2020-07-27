import { IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { PeriodsDto } from './periods.dto';
import { ClusterIdDto } from './clusters.dto';
import { IsBooleanNumber } from '../../common/decorators/isBooleanNumber.decorator';

export class ListMeaDto {
  @ApiProperty({ required: false })
  @IsBooleanNumber({ message: 'must be boolean or 1/0' })
  @IsOptional()
  public coque_status: boolean;
  @ApiProperty({ required: false })
  @IsBooleanNumber({ message: 'must be boolean or 1/0' })
  @IsOptional()
  public file_status: boolean;

  @ApiProperty({
    required: false,
    type: PeriodsDto,
    isArray: true,
    example: [{ month: 5, year: 2020 }],
  })
  public periods: PeriodsDto[];

  @ApiProperty({
    required: false,
    type: ClusterIdDto,
    isArray: true,
    // eslint-disable-next-line @typescript-eslint/camelcase
    example: [{ cluster_id: 1 }],
  })
  public clusters: ClusterIdDto[];
}
