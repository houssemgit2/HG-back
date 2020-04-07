import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from '../entities/User';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPwdDto } from './dto/reset-pwd.dto';
import * as generator from 'generate-password';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  logger = new Logger('Authentication :');
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

  async resetPwd(resetPwdDto: ResetPwdDto, user: User): Promise<any> {
    try {
      const { email } = resetPwdDto;
      const user = await User.findOne({ where: { email } });
      if (user.email === email) {
        const password: string = generator.generate({
          length: 10,
          numbers: true,
          uppercase: false,
        });
        this.logger.debug(password);
        user.password = password;
        this.logger.debug(user.email);
        const newUser = await user.save();
        return newUser;
      }
      this.logger.error(`given ${email} is not matched`);
    } catch (e) {
      return new NotFoundException(`email is not matched`);
    }
  }
}
