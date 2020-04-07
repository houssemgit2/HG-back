import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from '../entities/User';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { nextTick } from 'process';
import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPwdDto } from './dto/reset-pwd.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialDto: AuthCredentialDto): Promise<User> {
    try {
      return await this.userRepository.register(authCredentialDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async login(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string }> {
    try {
      const result = await this.userRepository.validateUserLogin(
        loginCredentialDto,
      );

      if (!result) throw new UnauthorizedException('Invalid credential');
      const payload: JwtPayload = { email: loginCredentialDto.email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }

  async resetPwd(resetPwdDto: ResetPwdDto): Promise<void> {
    // return this.userRepository.login(authCredentialDto);
  }
}
