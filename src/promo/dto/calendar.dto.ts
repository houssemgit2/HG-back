import {
  ArrayNotContains,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayNotContains([null, undefined], {
    message: 'idList must not be an array of null',
  })
  idList: number[];
}
