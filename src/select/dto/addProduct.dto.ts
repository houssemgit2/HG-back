import { ProductDto } from '../../promo/dto/product.dto';
import { Gamme } from '../../entities/Gamme';
import { IsUserAlreadyExist } from '../../common/decorators/isUnique.validation';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddProudctDto extends ProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsUserAlreadyExist(
    { message: 'Gamme not exist' },
    { entityName: 'Gamme', entity: Gamme, key: 'id' },
    false,
  )
  gamme_id: number;
}
