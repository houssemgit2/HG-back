import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
export class AuthCredentialDto {
  @IsNumber()
  storeId: number;

  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
  address: string;

  @IsNumber()
  phone: number;
}
