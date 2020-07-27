import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExist } from '../../common/decorators/isUnique.validation';
import { CoquePromo } from '../../entities/CoquePromo';
export class CoqueIdDto {
  @ApiProperty({ required: true })
  @IsNumberString()
  @IsUserAlreadyExist(
    { message: 'coque promo not found' },
    { entityName: 'coquePromo', entity: CoquePromo, key: 'id' },
    false,
  )
  coqueId: number;
}
