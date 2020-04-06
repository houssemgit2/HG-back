import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Next,
  Session,
  Ip,
  HttpCode,
  Redirect,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/User';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { AdminGard } from 'src/gards/admin.gard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('/auth/');
  @Post('register')
  async register(@Body() authCredentialDto: AuthCredentialDto): Promise<User> {
    this.logger.verbose(
      `adding user... ${authCredentialDto.firstName} ${authCredentialDto.lastName}`,
    );
    try {
      return await this.authService.register(authCredentialDto);
    } catch (e) {
      this.logger.error('failed to register new user');
      throw new InternalServerErrorException('e');
    }
  }

  @Post('login')
  signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`user is connecting... ${authCredentialDto.email} `);
    return this.authService.login(authCredentialDto);
  }

  @Post('reset-password')
  resetPwd(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.resetPwd(authCredentialDto);
  }

  // TODO this role is for development only

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req: any) {
    // console.log(ip);
    return req.user;
  }
  @Post('/test2')
  @UseGuards(AuthGuard(), AdminGard)
  test2(@Req() req: any) {
    // console.log(ip);
    return req.user;
  }
}
