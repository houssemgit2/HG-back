import { ApiProperty } from '@nestjs/swagger';
import {
  ValidateIf,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExist } from 'src/common/decorators/isUnique.validation';
import { Product } from '../../entities/Product';

export class ProductDto {
  @ApiProperty()
  @ValidateIf(o => o.id || !o.name)
  @IsNotEmpty()
  @IsNumber()
  @IsExist(
    { message: 'product id not found, use just name instead to create it' },
    { entityName: 'Product', entity: Product, key: 'id' },
    false,
  )
  id: number;

  @ApiProperty()
  @ValidateIf(o => !o.id)
  @IsOptional()
  @IsNumber()
  @IsExist(
    { message: 'ean id already exist' },
    { entityName: 'Product', entity: Product, key: 'ean' },
    true,
  )
  ean: number;

  @ApiProperty()
  @ValidateIf(o => !o.id)
  @IsNotEmpty()
  @IsString()
  name: string;
}
