import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../dist/auth/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.userRepository.register(authCredentialDto);
  }

  async login(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const result = await this.userRepository.validateUserLogin(
      authCredentialDto,
    );

    if (!result) throw new UnauthorizedException('Invalid credential');
    const payload: JwtPayload = { email: authCredentialDto.email };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async refresh(authCredentialDto: AuthCredentialDto): Promise<void> {
    // return this.userRepository.login(authCredentialDto);
  }

  async resetPwd(authCredentialDto: AuthCredentialDto): Promise<void> {
    // return this.userRepository.login(authCredentialDto);
  }
}
