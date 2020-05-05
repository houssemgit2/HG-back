import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class EditUserCredentialDto {
  @ApiProperty({ required: true })
  @MaxLength(255)
  @MinLength(3)
  fst_name?: string;

  @ApiProperty({ required: true })
  @MaxLength(255)
  @MinLength(3)
  lst_name?: string;

  @ApiProperty({ required: false })
  @MinLength(6)
  @MaxLength(255)
  password?: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ required: true })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ required: false })
  @IsNumber()
  phoneNum?: number;
}
