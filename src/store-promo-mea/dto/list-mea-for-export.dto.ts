import { ListMeaDto } from './list-mea.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { BookType } from 'xlsx/types';
const validType = ['xlsx', 'xlsm', 'xlsb', 'xls', 'xla', 'xlml', 'ods', 'csv'];
export class ListMeaToExportDto extends ListMeaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsEnum(validType, { message: `the available type are in ${validType}` })
  type?: BookType;
}
