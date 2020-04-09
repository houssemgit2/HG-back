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
  logger = new Logger('USER REPOS');
  async register(authCredentialDto: UserCredentialDto): Promise<User> {
    const {
      storeId,
      firstName,
      lastName,
      password,
      email,
      userRoleId,
      address,
    } = authCredentialDto;
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
    users.map(user => {
      user.transform();
      console.log(user);
    });
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
    if (user && (await user.validatePassword(password))) {
      user.transform();
      return user;
    }
    return null;
  }
  async updatepwd(user: User, password: string): Promise<any> {
    const salt = await bcrypt.genSalt();
    const newPwd = await this.hashPassword(password, salt);
    return this.save({ ...user, password: newPwd, salt });
  }
  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
