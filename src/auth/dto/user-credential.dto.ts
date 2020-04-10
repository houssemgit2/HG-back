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
  storeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  lastName: string;

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
  phone: number;
}
