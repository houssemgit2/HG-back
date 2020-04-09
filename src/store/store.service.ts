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
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
  ) {}
  logger = new Logger('Store service');

  async createOne(store: AddStoreDto, owner: UserCredentialDto, user: User) {
    try {
      //todo debug log
      this.logger.debug('adding new store...');
      const newStore: Store = await this.storeRepository.add(store);
      this.logger.debug('store added ');
      // console.log(newStore);

      owner.storeId = newStore.id;
      owner.userRoleId = 2;

      //      const newUser: User = await this.userRepository.register(owner);
      // const addedStore = await this.storeRepository.get(newStore.id);
      return newStore;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
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
