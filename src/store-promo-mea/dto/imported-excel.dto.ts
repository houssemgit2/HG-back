import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  ValidateIf,
} from 'class-validator';

export class ImportedExcelPromosJSon {
  @IsNotEmpty()
  @IsNumber()
  promoId: number;

  @IsNotEmpty()
  @IsNumber()
  storeId: number;
  @IsEnum(['REJECTED', 'CONFIRMED', undefined])
  state: 'REJECTED' | 'CONFIRMED' | undefined;

  @ValidateIf(o => o.state === 'REJECTED')
  @IsNotEmpty()
  rejectionReason?: string;
}
