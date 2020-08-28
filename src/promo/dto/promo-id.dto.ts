import { IsOptional, IsNumberString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExist } from '../../common/decorators/isUnique.validation';
import { Promo } from '../../entities/Promo';
import { Type } from 'class-transformer';
export class PromoIdDto {
  @ApiProperty({ required: true })
  @Type(() => Number)
  @IsNumber()
  @IsUserAlreadyExist(
    { message: 'promo id not found' },
    { entityName: 'Promo', entity: Promo, key: 'id' },
    false,
  )
  promoId: number;
}
