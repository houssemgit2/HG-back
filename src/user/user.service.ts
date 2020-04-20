import { Injectable } from '@nestjs/common';
import { UserRepository } from '../auth/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async findUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
  async findOne(id: number): Promise<User> {
    return await this.userRepository.findAndTransform(id);
  }
}
