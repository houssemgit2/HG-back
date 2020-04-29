import { Injectable, Logger } from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { AddStoreDto } from './dto/add-store.dto';
import { UserCredentialDto } from 'src/auth/dto/user-credential.dto';
import { User } from 'src/entities/User';
import { Store } from 'src/entities/Store';
import { GetStoreDto } from './dto/get-store.dto';
import { getRepository } from 'typeorm';
import { StorePermissionDto } from 'src/auth/dto/store-permission.dto';

@Injectable()
export class StoreService {
  constructor(private storeRepository: StoreRepository) {}
  logger = new Logger('Store service');

  async createOne(
    store: AddStoreDto,
    owner: UserCredentialDto,
    permission: StorePermissionDto[],
  ) {
    //todo debug log
    this.logger.debug('adding new store... for ' + owner.firstName);
    const result = await this.storeRepository.add(store, owner,permission);
    console.log(`the result is ${result}`);
    return result;
  }
  async getAllStore(filter: GetStoreDto) {
    // const storeList: Store[] = await this.storeRepository.findAll(filter);
    // console.log(storeList);
    const { perPage, page } = filter;

    // const query = getRepository(Store)
    //   .createQueryBuilder('store')
    //   .leftJoinAndSelect('cluster', 'cluster', 'cluster.id = s.cluster_id')
    //   .leftJoinAndSelect('user', 'owner', 'owner.id = s.cip');

    // if (filter.perPage && filter.page) {
    //   const offset: number = perPage * (page - 1);
    //   const limit: number = perPage;
    //   query.skip(offset).take(limit);
    // }
    try {
      // return await query.getRawMany();
      return await this.storeRepository.findAll(filter);
    } catch (e) {
      return e;
    }
  }
  async getStore(id: number) {
    return await this.storeRepository.findByIds([id]);
  }
  async updateStore(id: number) {
    console.log(id);
  }
  async removeStore(id: number) {
    console.log(id);
  }
}
