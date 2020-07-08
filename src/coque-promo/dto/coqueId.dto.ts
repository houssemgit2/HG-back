import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExist } from '../../common/decorators/isUnique.validation';
import { CoquePromo } from '../../entities/CoquePromo';
import { CoquePromoFiles } from '../../entities/CoquePromoFiles';
export class CoqueExistenceDto {
  @ApiProperty({ required: true })
  @IsNumberString()
  @IsUserAlreadyExist(
    { message: 'coque promo not found' },
    { entityName: 'coquePromo', entity: CoquePromo, key: 'id' },
    false,
  )
  coqueId: number;
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  @IsUserAlreadyExist(
    { message: 'file not found' },
    { entityName: 'coquePromoFiles', entity: CoquePromoFiles, key: 'id' },
    false,
  )
  fileId: number;
}
