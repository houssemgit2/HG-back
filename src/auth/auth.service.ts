/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as generator from 'generate-password';

import * as AWS from 'aws-sdk';

import moment = require('moment');

import { getRepository } from 'typeorm';

import { updatePasswordEmail } from '../common/email-body';
import { Resource } from '../entities/Resource';
import { StorePermission } from '../entities/StorePermission';
import { User } from '../entities/User';

import { UserRepository } from './user.repository';

import { LoginCredentialDto } from './dto/login-credential.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserCredentialDto } from './dto/user-credential.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
AWS.config.update({ region: 'us-east-1' });

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  logger = new Logger('Authentication :');
  async register(userCredentialDto: UserCredentialDto): Promise<User> {
    try {
      return await this.userRepository.register(userCredentialDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async transformUserObject(user) {
    const userObject: any = {};

    if (user) {
      userObject.fst_name = user.firstName;
      userObject.lst_name = user.lastName;
      userObject.store_cip = user.storeId;
      userObject.phone_num = user.phone;
      delete user.password;
      delete user.salt;
    }
    if (user && user.userRole) userObject.role = user.userRole.name;
    userObject.store = { ...user.store };
    if (user && user.store) userObject.store.cluster = user.store.clusters;
    if (user && user.store) {
      const resourcesName = await getRepository(Resource).find();
      userObject.store.access_permissions = user.store.storePermissions;
      userObject.store.access_permissions.map(item => {
        /**
store_cip: "3", resource: "LOT1"
 */
        item.store_cip = item.storeId;
        delete item.storeId;
        item.resource = resourcesName.find(
          resourceObject => resourceObject.id === item.resourceId,
        ).name;
        delete item.resourceId;
        return item;
      });
    }
    delete user.userRole;
    if (user && user.store) delete user.store.clusters;
    if (user && userObject.store) {
      delete userObject.store.clusters;
      delete userObject.store.storePermissions;
    }
    if (user) {
      delete user.firstName;
      delete user.lastName;
      delete user.storeId;
      delete user.phone;
    }
    return { id: user.id, ...userObject, ...user, store: userObject.store };
  }
  async login(loginCredentialDto: LoginCredentialDto): Promise<any> {
    try {
      const user: any = await this.userRepository.validateUserLogin(
        loginCredentialDto,
      );

      if (!user) throw new UnauthorizedException('Invalid credential');
      const payload: JwtPayload = { email: loginCredentialDto.email };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.verbose('connected succssefly');
      let permissions: any;
      if (user && user.userRoleId !== 1)
        permissions = await getRepository(StorePermission)
          .find({
            select: ['resourceId', 'allow'],
            where: { storeId: user?.store?.cip },
            relations: ['resource'],
          })
          .then(data => {
            const result = {};
            data.map(item => {
              result[item.resource.name] = item.allow;
            });
            return result;
          });
      return {
        permissions,
        token: {
          tokenType: 'Bearer',
          accessToken,
          expiresIn: moment()
            .add(1, 'months')
            .format(`YYYY-MM-DDTHH:mm:ss:sssZ`),
        },
        user: await this.transformUserObject(user),
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(e);
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

    const params: any = {
      Destination: {
        /* required */
        BccAddresses: [process.env.MAIL_BCC_ADDRESSES], //email.CcAddresses,
        ToAddresses: [email],
      },
      Message: {
        Body: updatePasswordEmail(password),
        Subject: {
          Charset: 'UTF-8',
          Data: 'Mot de passe  oublié',
        },
      },
      Source: process.env.MAIL_SOURCE, //email.Source,
      ReplyToAddresses: [process.env.MAIL_SOURCE], //[email.Source],
    };

    try {
      await this.userRepository.updatePassword(user, password);

      const message = await new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise();
      this.logger.debug(message);
      return {
        data:
          'success a mail has been sent to the site admin we will send you your password as soon as possible',
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
