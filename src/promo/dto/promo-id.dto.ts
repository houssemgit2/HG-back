import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { Promo } from '../../entities/Promo';
export class PromoIdDto {
  @ApiProperty({ required: true })
  @IsExist(
    { message: 'promo id not found' },
    { entityName: 'Promo', entity: Promo, key: 'id' },
    false,
  )
  promoId: number;
}
