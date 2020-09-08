import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import * as moment from 'moment';
import { GammeDto } from './gamme.dto';
import { ProductDto } from './product.dto';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { PromoConcernedType } from '../../entities/PromoConcernedType';

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
  @Type(() => Number)
  public laboratory_id: number;

  @ApiProperty({
    required: true,
    example: 2,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsExist(
    {
      message: 'concerned id not found',
    },
    {
      entityName: 'PromoConcernedType',
      entity: PromoConcernedType,
      key: 'id',
    },
    false,
  )
  public promo_concerned_id: number;

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
    example: 'all',
  })
  @IsEnum(['all', 'some', 'exclude'])
  public option_product: 'all' | 'some' | 'exclude';

  @ApiProperty({
    required: false,
    type: ProductDto,
    example: { id: 1, ean: 3121321, name: 'product' },
  })
  @ValidateNested({ always: true, each: true })
  @Type(() => ProductDto)
  @IsNotEmpty({ groups: ['concerned_product'] })
  @IsOptional({ groups: ['concerned_gamme'] })
  public product: ProductDto;

  @ApiProperty({
    required: false,
    type: ProductDto,
    isArray: true,
    example: [{ id: 1, name: 'product' }],
  })
  @ValidateNested({ always: true, each: true })
  @Type(() => ProductDto)
  @IsNotEmpty({ groups: ['concerned_gamme', 'some_product'] })
  @IsOptional({ groups: ['all_product'] })
  public products_in: ProductDto[];
  @ApiProperty({
    required: false,
    type: ProductDto,
    isArray: true,
    example: [{ id: 1, name: 'product' }],
  })
  @ValidateNested({ always: true, each: true })
  @Type(() => ProductDto)
  @IsNotEmpty({ groups: ['concerned_gamme', 'some_product'] })
  @IsOptional({ groups: ['all_product'] })
  public products_out: ProductDto[];

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
  @IsOptional()
  public comment: string;

  // UnitCapacity
  @ApiProperty({
    required: false,
    type: Number,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Number)
  @IsNotEmpty({ groups: ['concerned_product'] })
  @IsOptional({ groups: ['concerned_gamme'] })
  public value_unit_capacity: number;

  @ApiProperty({
    required: false,
    type: Boolean,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Boolean)
  @IsNotEmpty({ groups: ['concerned_product'] })
  @IsOptional({ groups: ['concerned_gamme'] })
  public is_lot: boolean;

  @ApiProperty({
    required: false,
    type: Number,
    // isArray: true,
    // example: [1, 3],
  })
  @Type(() => Number)
  @IsNotEmpty({ groups: ['concerned_product', 'with_lot'] })
  @IsOptional({ groups: ['without_lot'] })
  public qnt_product_lot: number;
}
