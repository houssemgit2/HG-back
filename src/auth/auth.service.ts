import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialDto } from './dto/user-credential.dto';
import { User } from '../entities/User';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as generator from 'generate-password';
import * as AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  logger = new Logger('Authentication :');
  async register(authCredentialDto: UserCredentialDto): Promise<User> {
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

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    user: User,
  ): Promise<any> {
    const { email } = resetPasswordDto;
    // const user = await User.findOne({ where: { email } });
    if (user.email !== email)
      throw new BadRequestException(`email is not matched`);
    const password: string = generator.generate({
      length: 10,
      numbers: true,
      uppercase: false,
    });

    // todo: remove this, debugging code
    this.logger.debug('updating password...');

    const params: any = {
      Destination: {
        /* required */
        BccAddresses: [process.env.MAIL_BCC_ADDRESSES], //email.CcAddresses,
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>Bonjour</p>
  <p>Votre nouveau mot de passe est :  <strong>${password}</strong> </p> <p>L'équipe support</p>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Bonjour,
         Votre nouveau mot de passe est : ${password}
          
          Equipe de support`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Mot de passe  oublié',
        },
      },
      Source: process.env.MAIL_SOURCE, //email.Source,
      ReplyToAddresses: [process.env.MAIL_SOURCE], //[email.Source],
    };

    try {
      await this.userRepository.updatepwd(user, password);

      const message = await new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise();
      this.logger.debug(message);
      return {
        data:
          'success a mail has been sent to the site admin we will send you your password as soon as possible',
      };
    } catch (e) {
      throw new BadRequestException("couldn't reset password");
    }
  }
}
