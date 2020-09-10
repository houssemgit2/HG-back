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
import { UserCredentialDto } from './dto/user-credential.dto';
import { AuthService } from './auth.service';
import { User } from '../entities/User';
import { AuthGuard } from '@nestjs/passport';
import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserReq } from './get-user.decorator';
import { AdminGuard } from './guards/admin.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('/auth/');

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, description: 'Return the new user parameters' })
  @Post('register')
  async register(@Body() userCredentialDto: UserCredentialDto): Promise<User> {
    this.logger.verbose(
      `adding user... ${userCredentialDto.firstName} ${userCredentialDto.lastName}`,
    );
    try {
      return await this.authService.register(userCredentialDto);
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 200, description: 'Return new password' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'Email not matched' })
  @Post('reset-password')
  @UseGuards(AuthGuard())
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @UserReq() user: User,
  ): Promise<void> {
    this.logger.verbose('reset password');
    return this.authService.resetPassword(resetPasswordDto, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'this user' })
  @ApiResponse({ status: 200, description: 'return the connected user' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@UserReq() user: User) {
    // console.log(ip);
    return user;
  }
}
