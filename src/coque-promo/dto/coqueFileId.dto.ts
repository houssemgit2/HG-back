import { IsNumberString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { CoquePromoFiles } from '../../entities/CoquePromoFiles';
import { CoqueIdDto } from './coqueId.dto';
import { Type } from 'class-transformer';
export class CoqueFileIdDto extends CoqueIdDto {
  @ApiProperty({ required: true, type: 'number' })
  // @Type(() => Number)
  // @IsNumber()
  // @IsNotEmpty()
  // @IsExist(
  //   { message: 'file not found' },
  //   {
  //     entityName: 'coquePromoFiles',
  //     entity: CoquePromoFiles,
  //     key: 'id',
  //   },
  //   false,
  // )
  fileId: number;
}
