import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './auth-credential.dto';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  private mockUser = {
    email: 'firas@smala.com',
    token: 'jwt.token.here',
    username: 'firas',
    userRole: 'admin',
    storeId: 23,
  };
  async register(authCredentialDto: AuthCredentialDto): Promise<User> {
    return this.userRepository.save(authCredentialDto);
  }

  async login(authCredentialDto: AuthCredentialDto) {
    if (authCredentialDto.email === this.mockUser.email) return this.mockUser;
    throw new InternalServerErrorException();
  }

  async refresh(authCredentialDto: AuthCredentialDto): Promise<void> {
    // return this.userRepository.login(authCredentialDto);
  }

  async resetPwd(authCredentialDto: AuthCredentialDto): Promise<void> {
    // return this.userRepository.login(authCredentialDto);
  }
}
