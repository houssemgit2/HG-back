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
import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPwdDto } from './dto/reset-pwd.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { IGetUserAuthInfoRequest } from './interface/user.interface';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('/auth/');

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, description: 'Return the new user paramters' })
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

  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({ status: 200, description: 'Return token' })
  @ApiResponse({ status: 403, description: 'Incorrect mail or password' })
  @Post('login')
  signIn(
    @Body() loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`user is connecting... ${loginCredentialDto.email}`);
    return this.authService.login(loginCredentialDto);
  }
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Return new password' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Email not matched' })
  @Post('reset-password')
  @UseGuards(AuthGuard())
  resetPwd(
    @Body() resetPwdDto: ResetPwdDto,
    @Req() req: IGetUserAuthInfoRequest,
  ): Promise<void> {
    const user: User = req.user;
    this.logger.verbose('reset passowrd');
    return this.authService.resetPwd(resetPwdDto, user);
  }

  // TODO this role is for development only
  @ApiOperation({ summary: 'this user' })
  @ApiResponse({ status: 200, description: 'return the connected user' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req: IGetUserAuthInfoRequest) {
    // console.log(ip);
    return req.user;
  }
}
