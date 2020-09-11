import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import * as moment from 'moment';
import { GammeDto } from './gamme.dto';
import { ProductDto } from './product.dto';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { PromoConcernType } from '../../entities/PromoConcernedType';
import { IsArray } from 'class-validator';
import { ProductConcernType } from '../../entities/ProductConcernType';
import { IsEmptyIf } from '../../common/decorators/isEmpty.decorator';

export class PromoGeneralPromoDto {
  @ApiProperty({
    required: true,
    type: Date,
    // example: [1, 3],
  })
  @Transform(value => moment(value).format('YYYY-MM-DD'))
  @Type(() => Date)
  //   @IsDate()
  public start_date: Date;

  @ApiProperty({
    required: true,
    type: Date,
    // example: [1, 3],
  })
  @Transform(value => moment(value).format('YYYY-MM-DD'))
  @Type(() => Date)
  //   @IsDate()
  public end_date: Date;

  @ApiProperty({
    required: true,
    type: Number,
    // example: [1, 3],
  })
  // @Type(() => Number)
  public laboratory_id: number;

  @ApiProperty({
    required: true,
    example: 2,
  })
  // @Type(() => Number)
  @IsNotEmpty()
  @IsExist(
    {
      message: 'concerned id not found',
    },
    {
      entityName: 'PromoConcernType',
      entity: PromoConcernType,
      key: 'id',
    },
    false,
  )
  public promo_concern_type_id: number;

  @ApiProperty({
    required: true,
    example: 2,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsExist(
    {
      message: 'product  concerned type id not found',
    },
    {
      entityName: 'ProductConcernType',
      entity: ProductConcernType,
      key: 'id',
    },
    false,
  )
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf(o => o.promo_concern_type_id === 1)
  product_concern_type_id: number;

  @ApiProperty({
    required: true,
    type: GammeDto,
    example: { id: 1, name: 'gamme' },
  })
  @Type(() => GammeDto)
  @ValidateNested({ always: true, each: true })
  @IsNotEmpty()
  public gamme: GammeDto;

  @ApiProperty({
    required: false,
    type: ProductDto,
    example: { id: 1, ean: 3121321, name: 'product' },
  })
  @ValidateNested({ always: true, each: true })
  @Type(() => ProductDto)
  // @IsNotEmpty({ groups: ['concerned_product'] })
  // @IsOptional({ groups: ['concerned_gamme'] })
  @IsNotEmpty()
  @ValidateIf(o => o.promo_concern_type_id == 2)
  public product: ProductDto;

  @ApiProperty({
    required: false,
    type: Number,
    isArray: true,
    example: [1, 2],
  })
  @ValidateNested({ always: true, each: true })
  @IsArray()
  // @IsNotEmpty({ groups: ['concerned_gamme', 'some_product'] })
  // @IsOptional({ groups: ['all_product'] })
  @ValidateIf(
    o =>
      o.promo_concern_type_id === 1 &&
      (o.product_concern_type_id == 2 || o.product_concern_type_id == 3),
  )
  public product_ids: number[];

  @ApiProperty({
    required: false,
    type: String,
    isArray: true,
    example: ['1st new product name'],
  })
  @ValidateNested({ always: true, each: true })
  @ValidateIf(
    o =>
      (o.product_concern_type_id == 2 || o.product_concern_type_id == 3) &&
      o.promo_concern_type_id == 1,
  )
  @IsOptional({
    groups: ['concerned_gamme', 'some_product'],
  })
  public new_products: string[];

  @ApiProperty({
    required: true,
    type: Number,
    isArray: true,
    example: [1, 3],
  })
  @IsNotEmpty()
  public clusters_id: number[];

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  public comment: string;

  // UnitCapacity
  @ApiProperty({
    required: false,
    type: Number,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Number)
  @IsNumber()
  // @IsNotEmpty({ groups: ['concerned_product'] })
  // @IsOptional({ groups: ['concerned_gamme'] })
  @IsNotEmpty()
  @ValidateIf(o => o.promo_concern_type_id === 2)
  public measure_value: number;

  // UnitCapacity
  @ApiProperty({
    required: false,
    type: Number,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Number)
  @IsNumber()
  // @IsNotEmpty({ groups: ['concerned_product'] })
  // @IsOptional({ groups: ['concerned_gamme'] })
  @IsNotEmpty()
  @ValidateIf(o => o.promo_concern_type_id === 2)
  public measure_type_id: number;

  @ApiProperty({
    required: false,
    type: Boolean,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Boolean)
  @IsBoolean()
  // @IsNotEmpty({ groups: ['concerned_product'] })
  // @IsOptional({ groups: ['concerned_gamme'] })
  @IsNotEmpty()
  @ValidateIf(o => o.promo_concern_type_id === 2)
  public is_lot: boolean;

  @ApiProperty({
    required: false,
    type: Number,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Number)
  @IsNumber()
  // @IsNotEmpty({ groups: ['concerned_product', 'with_lot'] })
  // @IsOptional({ groups: ['without_lot'] })
  @IsNotEmpty()
  @ValidateIf(o => o.promo_concern_type_id === 2 && o.is_lot === true)
  public quantity_lot: number;
  // property
  public gammeId: number;
}
