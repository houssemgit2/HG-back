import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Next,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/User';
import { AuthGuard } from '@nestjs/passport';
import { AdminGard } from 'src/auth/gards/admin.gard';
import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPwdDto } from './dto/reset-pwd.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('/auth/');

  @ApiBody({ type: [AuthCredentialDto] })
  @Post('register')
  async register(@Body() authCredentialDto: AuthCredentialDto): Promise<User> {
    this.logger.verbose(
      `adding user... ${authCredentialDto.firstName} ${authCredentialDto.lastName}`,
    );
    try {
      return await this.authService.register(authCredentialDto);
    } catch (e) {
      this.logger.error('failed to register new user');
      throw new InternalServerErrorException(e);
    }
  }

  @Post('login')
  signIn(
    @Body() loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`user is connecting... ${loginCredentialDto.email}`);
    return this.authService.login(loginCredentialDto);
  }

  @Post('reset-password')
  resetPwd(@Body() resetPwdDto: ResetPwdDto): Promise<void> {
    return this.authService.resetPwd(resetPwdDto);
  }

  // TODO this role is for development only

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req: any) {
    // console.log(ip);
    return req.user;
  }
}
