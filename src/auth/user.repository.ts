import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/User';
import { UserCredentialDto } from './dto/user-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginCredentialDto } from './dto/login-credential.dto';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }
  logger = new Logger('USER REPOSitory');
  async register(userCredentialDto: UserCredentialDto): Promise<User> {
    const {
      storeId,
      firstName,
      lastName,
      password,
      email,
      userRoleId,
      address,
    } = userCredentialDto;
    const exists = await this.findOne({ email });
    if (!exists)
      this.logger.setContext(
        `we didn't find a user with this email:${email}, w're creating a new one ...`,
      );
    if (exists)
      throw new ConflictException(`${email} already token by another user`);

    const user = new User();
    user.storeId = storeId;
    user.userRoleId = userRoleId;
    user.firstName = firstName;
    user.lastName = lastName;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.email = email;
    user.address = address;

    const newUser = await user.save();
    newUser.transform();
    return newUser;
  }

  async findAll(): Promise<any> {
    const users = await this.find();
    // users.map(user => {
    //   user.transform();
    //   console.log(user);
    // });
    return users;
  }
  async findAndTransform(id: number): Promise<User> {
    const user = await this.findOne({ id });
    user.transform();
    return user;
  }
  async validateUserLogin(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<User> {
    const { email, password } = loginCredentialDto;
    const user = await this.findOne({ email });
    console.log('find user ***********>', user);
    try {
      const valid = await user.validatePassword(password);
      if (user && valid) {
        user.transform();
        return user;
      } else {
        throw new Error('invalid credential');
      }
    } catch (e) {
      console.error('failed to validate--');
      return e;
    }
  }
  async generateSaltPassword(password: string): Promise<any> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await this.hashPassword(password, salt);
    return { password: hashPassword, salt };
  }
  async updatePassword(user: User, password: string): Promise<any> {
    const passwordSalt = this.generateSaltPassword(password);
    return this.save({ ...user, ...passwordSalt });
  }
  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
