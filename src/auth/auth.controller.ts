import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/User';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.authService.register(authCredentialDto);
  }

  @Post('login')
  signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
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

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req.user);
  }
}
