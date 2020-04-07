import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ResetPwdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
