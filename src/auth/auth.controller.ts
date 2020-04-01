import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthCredentialDto } from './auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/User';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() authCredentialDto: AuthCredentialDto): Promise<User> {
    console.log(authCredentialDto);
    return this.authService.register(authCredentialDto);
  }

  @Post('login')
  signIn(@Body() authCredentialDto: AuthCredentialDto) {
    return this.authService.login(authCredentialDto);
  }

  @Post('refresh-token')
  refeshToken(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.refresh(authCredentialDto);
  }

  @Post('reset-password')
  resetPwd(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.resetPwd(authCredentialDto);
  }
}
