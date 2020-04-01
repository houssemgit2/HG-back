import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/User';
import { AuthCredentialDto } from './auth-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
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
    const user = new User();
    user.storeId = storeId;
    user.userRoleId = userRoleId;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = password;
    user.email = email;
    user.address = address;

    const found = await user.save();
    return found;
  }

  async login(authCredentialDto: AuthCredentialDto) {}
}
