import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginCredentialDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
