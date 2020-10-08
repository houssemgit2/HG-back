import { ApiProperty } from '@nestjs/swagger';

import { IsNumberString } from 'class-validator';

import { Type } from 'class-transformer';

import { CoquePromo } from '../../entities/CoquePromo';
import { IsExist } from '../../common/decorators/isUnique.validation';
export class CoqueIdDto {
  @ApiProperty({ required: true })
  // @IsNumberString()
  @IsExist(
    { message: 'coque promo not found' },
    { entityName: 'coquePromo', entity: CoquePromo, key: 'id' },
    false,
  )
  @Type(() => Number)
  coqueId: number;
}
