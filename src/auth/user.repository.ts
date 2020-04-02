import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/User';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async register(authCredentialDto: AuthCredentialDto): Promise<User> {
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

  async validateUserLogin(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { email, password } = authCredentialDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password))) {
      user.transform();
      return user;
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
