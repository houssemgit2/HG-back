import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
export class AuthCredentialDto {
  @IsNotEmpty()
  @IsNumber()
  storeId: number;

  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @MinLength(5)
  password: string;

  @IsEmail()
  email: string;
  address: string;

  @IsNumber()
  phone: number;
}
