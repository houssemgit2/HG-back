import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UserCredentialDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sto_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  fst_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  lst_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsNumber()
  role: number;

  @ApiPropertyOptional()
  @IsNumber()
  phoneNum: number;
}
