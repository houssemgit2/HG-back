import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { AddStoreDto } from './dto/add-store.dto';
import { UserCredentialDto } from 'src/auth/dto/user-credential.dto';
import { User } from 'src/entities/User';
import { UserRepository } from '../auth/user.repository';
import { Store } from 'src/entities/Store';
import { GetStoreDto } from './dto/get-store.dto';

@Injectable()
export class StoreService {
  constructor(private storeRepository: StoreRepository) {}
  logger = new Logger('Store service');

  async createOne(store: AddStoreDto, owner: UserCredentialDto, user: User) {
    //todo debug log
    this.logger.debug('adding new store...');
    const result = await this.storeRepository.add(store, owner);
    console.log(`the result is ${result}`);
    return result;
  }
  async getAll(filter: GetStoreDto) {
    this.storeRepository.findAll();
  }
  async getStore(id: number) {
    console.log(id);
  }
  async updateStore(id: number) {
    console.log(id);
  }
  async removeStore(id: number) {
    console.log(id);
  }
}
