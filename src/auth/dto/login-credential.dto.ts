import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
export class LoginCredentialDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
