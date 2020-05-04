/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, Logger } from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { AddStoreDto } from './dto/add-store.dto';
import { UserCredentialDto } from '../user/dto/user.dto';
import { User } from 'src/entities/User';
import { Store } from 'src/entities/Store';
import { GetStoreDto } from './dto/get-store.dto';
import { getRepository } from 'typeorm';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { UserRepository } from 'src/auth/user.repository';
import { StorePermission } from 'src/entities/StorePermission';
import { EditStoreDto } from './dto/edit-store.dto';
import { StoreOwnerDto } from './dto/store-owner.dto';
import { EditUserCredentialDto } from '../user/dto/edit-user.dto';

@Injectable()
export class StoreService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
  ) {}
  logger = new Logger('Store service');

  async createOne(
    addStore: AddStoreDto,
    owner: UserCredentialDto,
    permissions: StorePermissionDto[],
  ) {
    const store: Store = new Store();
    store.clusterId = addStore.clu_id;
    store.cip = addStore.cip;
    store.name = addStore.descr;
    const newOwner: User = new User();
    newOwner.storeId = addStore.cip;
    newOwner.firstName = owner.fst_name;
    newOwner.lastName = owner.lst_name;
    newOwner.email = owner.email;
    newOwner.phone = `${owner.phoneNum}`;
    newOwner.address = owner.address;
    newOwner.storeId = owner.sto_id;
    newOwner.userRoleId = owner.role;
    const password_salt: any = this.userRepository.generateSaltPassword(
      owner.password,
    );
    console.log('the generated assword is ------->', password_salt);
    newOwner.password = password_salt.password;
    newOwner.salt = password_salt.salt;

    const storePermissions = permissions.map(item => {
      const permis = new StorePermission();
      permis.storeId = item.store_cip;
      permis.resourceId = item.resource_id;
      permis.allow = item.allow;
      return permis;
    });
    //todo debug log
    this.logger.debug('adding new store... for ' + owner);
    const result = await this.storeRepository.add(
      store,
      newOwner,
      storePermissions,
      false,
    );
    console.log(`the result is ${result}`);
    return result ? result : { data: 'added successful ' };
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
  async updateStore(
    id: number,
    addStore: EditStoreDto,
    owner: EditUserCredentialDto,
    permissions: StorePermissionDto[],
  ) {
    const store: Store = new Store();
    store.id = id;
    if (addStore.clu_id) store.clusterId = addStore.clu_id;
    if (addStore.cip) store.cip = addStore.cip;
    if (addStore.descr) store.name = addStore.descr;
    const newOwner: User = new User();
    if (owner) {
      newOwner.id = addStore.cip;
      newOwner.firstName = owner.fst_name;
      newOwner.lastName = owner.lst_name;
      newOwner.email = owner.email;
      newOwner.phone = `${owner.phoneNum}`;
      newOwner.address = owner.address;
    }
    if (owner.password) {
      const password_salt: any = this.userRepository.generateSaltPassword(
        owner.password,
      );
      console.log('the generated assword is ------->', password_salt);
      newOwner.password = password_salt.password;
      newOwner.salt = password_salt.salt;
    }
    const storePermissions = permissions
      ? permissions.map(item => {
          const permis = new StorePermission();
          permis.storeId = item.store_cip;
          permis.resourceId = item.resource_id;
          permis.allow = item.allow;
          return permis;
        })
      : null;
    const result = await this.storeRepository.add(
      store,
      newOwner,
      storePermissions,
      true,
    );
    return result;
  }
  async removeStore(id: number) {
    console.log(id);
  }
}
