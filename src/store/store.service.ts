/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { AddStoreDto } from './dto/add-store.dto';
import { User } from 'src/entities/User';
import { Store } from 'src/entities/Store';
import { GetStoreDto } from './dto/get-store.dto';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { UserRepository } from 'src/auth/user.repository';
import { StorePermission } from 'src/entities/StorePermission';
import { EditStoreDto } from './dto/edit-store.dto';
import { EditUserCredentialDto } from '../user/dto/edit-user.dto';
import { AddOwnerDto } from './dto/add-owner.dto';

@Injectable()
export class StoreService {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
  ) {}
  logger = new Logger('Store service');

  async createOne(
    addStore: AddStoreDto,
    owner: AddOwnerDto,
    permissions: StorePermissionDto[],
  ) {
    const store: Store = new Store();
    store.clusterId = addStore.clu_id;
    store.id = addStore.cip;
    store.name = addStore.descr;
    const newOwner: User = new User();
    newOwner.storeId = addStore.cip;
    newOwner.firstName = owner.fst_name;
    newOwner.lastName = owner.lst_name;
    newOwner.email = owner.email;
    newOwner.phone = owner.phone_num;
    newOwner.address = owner.address;
    newOwner.userRoleId = 2;
    const password_salt: any = await this.userRepository.generateSaltPassword(
      owner.password,
    );
    console.log('the generated password is ------->', password_salt);
    newOwner.password = password_salt.password;
    newOwner.salt = password_salt.salt;

    const storePermissions = permissions.map(item => {
      const permis = new StorePermission();
      permis.resourceId = item.resource;
      permis.allow = item.allow;
      permis.storeId = store.id;
      return permis;
    });
    const result = await this.storeRepository.add(
      store,
      newOwner,
      storePermissions,
      false,
    );
    console.log(`the result is ${result}`);
    return this.storeV1Key(result);
  }
  async getAllStore(filter: GetStoreDto) {
    try {
      return await this.storeRepository.findAll(filter);
    } catch (e) {
      return e;
    }
  }
  async getStore(id: number) {
    try {
      return await this.storeRepository.findOne(
        { id },
        { relations: ['storePermissions'] },
      );
    } catch (e) {
      console.error(`could not find one store by id cip`);
      throw new InternalServerErrorException(e);
    }
  }
  async updateStore(
    id: number,
    addStore: EditStoreDto,
    owner: EditUserCredentialDto,
    permissions: StorePermissionDto[],
  ) {
    const store: Store = new Store();
    store.id = id;
    store.cip = addStore.cip;
    if (addStore.clu_id) store.clusterId = addStore.clu_id;
    if (addStore.descr) store.name = addStore.descr;
    const newOwner: User = new User();
    if (owner) {
      newOwner.id = addStore.cip;
      newOwner.firstName = owner.fst_name;
      newOwner.lastName = owner.lst_name;
      newOwner.email = owner.email;
      newOwner.phone = owner.phone_num;
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
          permis.storeId = store.cip;
          permis.resourceId = item.resource;
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
  async findByCip(cip: number): Promise<Store> {
    try {
      return await this.storeRepository.findOne({ cip });
    } catch (e) {
      console.error(`could not find one store by id cip`);
      throw new InternalServerErrorException(e);
    }
  }
  async removeStore(id: number) {
    return await this.storeRepository.deleteStore(id);
  }
  storeV1Key(store: Store): any {
    const storeV1: any = {};
    storeV1.cip = store.id;
    storeV1.owner_id = store.cip;
    storeV1.descr = store.name;
    storeV1.clu_id = store.clusterId;

    delete store.id;
    delete store.cip;
    delete store.name;
    delete store.clusterId;
    return { ...storeV1, ...store };
  }
}
