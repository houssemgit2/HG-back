import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { OptionalNameDto } from './optional-name.dto';

export class RemunerationDto extends OptionalNameDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(['ca_target', 'ca_plate', 'remuneration_fixed', 'remuneration_base'])
  remuneration_filed:
    | 'ca_target'
    | 'ca_plate'
    | 'remuneration_fixed'
    | 'remuneration_base';

  targetEntity: any;
  entityName: string;
}
