import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import * as moment from 'moment';
import { IsNull } from 'typeorm';
// enum ProductOptions {
//   ALL = 'all',
//   SOME = 'some',
//   EXCLUDE = 'exclude',
// }
export class SaveGeneralPromoDto {
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
    type: String,
    example: 'gamme',
  })
  // @Type(() => Number)
  @IsNotEmpty()
  @IsEnum(['gamme', 'product'])
  public concerned: 'gamme' | 'product';

  @ApiProperty({
    required: true,
    type: Number,
    // example: [1, 3],
  })
  @Type(() => Number)
  public gamme_id: number;

  @ApiProperty({
    required: false,
    example: 'all',
  })
  @IsEnum(['all', 'some', 'exclude'])
  public option_product: 'all' | 'some' | 'exclude';

  @ApiProperty({
    required: false,
    type: Number,
    // example: [1, 3],
  })
  @IsNotEmpty({ groups: ['concerned_product'] })
  @IsOptional({ groups: ['concerned_gamme'] })
  public product_id: number;

  @ApiProperty({
    required: false,
    type: Number,
    // example: [1, 3],
  })
  @IsOptional({ groups: ['concerned_product'] })
  public ean: number;

  @ApiProperty({
    required: false,
    type: Number,
    isArray: true,
    example: [1, 3],
  })
  @IsNotEmpty({ groups: ['concerned_gamme', 'some_product'] })
  @IsOptional({ groups: ['all_product'] })
  public products_in: number[];

  @ApiProperty({
    required: false,
    type: Number,
    isArray: true,
    example: [1, 3],
  })
  @IsNotEmpty({ groups: ['concerned_gamme', 'exclude_product'] })
  @IsOptional({ groups: ['all_product'] })
  public products_out: number[];

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
  public lot: boolean;

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
