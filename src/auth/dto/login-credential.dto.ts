import { IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginCredentialDto {
  @ApiProperty({ example: 'jonathan@smala.co' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'smalaa' })
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}
