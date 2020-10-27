/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { AddStoreDto } from './dto/add-store.dto';
import { User } from '../entities/User';
import { Store } from '../entities/Store';
import { PaginationDto } from '../common/dto/pagination.dto';
import { StorePermissionDto } from '../store/dto/store-permission.dto';
import { UserRepository } from '../auth/user.repository';
import { StorePermission } from '../entities/StorePermission';
import { EditStoreDto } from './dto/edit-store.dto';
import { EditUserCredentialDto } from '../user/dto/edit-user.dto';
import { AddOwnerDto } from './dto/add-owner.dto';
import { InjectEventEmitter } from 'nest-emitter';
import { StoreEventEmitter } from '../app.events';
import { getConnection, getRepository } from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Resource } from '../entities/Resource';
import { StorePromoMeaRepository } from '../store-promo-mea/store-promo-mea.repository';
@Injectable()
export class StoreService implements OnModuleInit {
  constructor(
    private storeRepository: StoreRepository,
    private userRepository: UserRepository,
    private storePromoMeaRepository: StorePromoMeaRepository,
    @InjectEventEmitter() private readonly emitter: StoreEventEmitter,
  ) {}
  onModuleInit() {
    this.emitter.on('storeCreated', async (clusterId, storeId) => {
      const testCluster = await this.saveMeaByStore(storeId);
      console.log(testCluster);
    });
  }
  logger = new Logger('Store service');
  async saveMeaByStore(storeId: number): Promise<any> | null {
    let promosIds: StorePromoMea[];
    await this.storePromoMeaRepository
      .findPromoMeaByIdPromoStore(null, null, storeId)
      .then(data => {
        promosIds = data;
      });
    console.log('promos list to add to the store', storeId);
    if (promosIds && promosIds.length)
      return await getConnection()
        .createQueryBuilder()
        .insert()
        .into(StorePromoMea)
        .values(promosIds)
        .execute();
    this.logger.warn(`no store promo mea concern store ${storeId}`);
    this.logger.setContext(`no store promo mea concern store ${storeId}`);
    return null;
  }
  async createOne(
    addStore: AddStoreDto,
    owner: AddOwnerDto,
    permissions: StorePermissionDto[],
  ): Promise<any> {
    const store: Store = new Store();
    store.clusterId = addStore.clu_id;
    store.cip = addStore.cip;
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
    const resources = await getRepository(Resource).find();
    const storePermissions = permissions.map(item => {
      const permis = new StorePermission();

      const resourceId = resources.find(res => res.name === item.resource);
      if (!resourceId)
        throw new BadRequestException(
          `the ${
            item.resource
          } is not a defined resource, it has to be in ${resources
            .map(item => item.name)
            .toString()}`,
        );
      console.log('resource ', resourceId);
      permis.resourceId = resourceId.id;
      permis.allow = item.allow;
      permis.storeId = store.cip;
      return permis;
    });
    const result = await this.storeRepository.add(
      store,
      newOwner,
      storePermissions,
      false,
    );
    console.log(`the result is `, result);
    return result;
  }
  async getAllStore(filter: PaginationDto) {
    try {
      const stores = await this.storeRepository.findAll(filter).then(data => {
        if (data) return data.map(store => this.storeV1Key(store));
        else return data;
      });
      return stores;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async getStore(cip: number) {
    this.logger.debug(`fetching store cip where cip = ${cip}`);
    const store = await this.storeRepository.getOne(cip).then(store => {
      if (!store)
        throw new NotFoundException(`there is no store with cip ${cip}`);
      return this.storeV1Key(store);
    });
    if (!store) throw new NotFoundException(`there is no store with id ${cip}`);
    return store;
  }
  async updateStore(
    cip: number,
    addStore: EditStoreDto,
    owner: EditUserCredentialDto,
    permissions: StorePermissionDto[],
  ) {
    const store: Store = await this.storeRepository.getOne(cip);
    // console.log(store);
    const oldStoreClusterId = store.clusterId;
    store.cip = cip;
    if (addStore.clu_id) store.clusterId = addStore.clu_id;
    if (addStore.descr) store.name = addStore.descr;
    const newOwner: User = Array.isArray(store.users)
      ? store.users[0]
      : store.users;
    if (owner) {
      this.logger.verbose('********** owner');
      if (owner.fst_name) newOwner.firstName = owner.fst_name;
      if (owner.lst_name) newOwner.lastName = owner.lst_name;
      if (owner.email) newOwner.email = owner.email;
      if (owner.phone_num) newOwner.phone = owner.phone_num;
      if (owner.address) newOwner.address = owner.address;
    }
    if (owner && owner.password) {
      const password_salt: any = await this.userRepository.generateSaltPassword(
        owner.password,
      );
      newOwner.password = password_salt.password;
      newOwner.salt = password_salt.salt;
    }
    const resources = await getRepository(Resource).find();
    const storePermissions = permissions
      ? permissions.map(item => {
          const permis = new StorePermission();
          const resourceId = resources.find(res => res.name === item.resource);
          permis.resourceId = resourceId.id;
          permis.storeId = store.cip;
          permis.allow = item.allow;
          return permis;
        })
      : null;

    const result = await this.storeRepository.edit(
      store,
      newOwner,
      storePermissions,
    );
    if (oldStoreClusterId !== store.clusterId) {
      this.logger.debug(`updating promo mea for the store ${store.cip}`);
      await this.storePromoMeaRepository.afterStoreClusterChanged(store.cip);
    } else
      this.logger.debug(
        `store ${store.cip} updated but kept the same cluster we don't need to check mea promo `,
      );
    return result;
  }
  async findByCip(cip: number): Promise<Store> {
    try {
      return await this.storeRepository
        .findOne({ cip })
        .then(store => this.storeV1Key(store));
    } catch (e) {
      console.error(`could not find one store by id cip`);
      throw new InternalServerErrorException(e);
    }
  }
  async removeStore(id: number) {
    return await this.storeRepository.deleteStore(id);
  }
  storeV1Key(store: Store): any {
    const storeV1: any = { cip: store.cip };
    storeV1.descr = store.name;
    storeV1.clu_id = store.clusterId;
    if (store.storePermissions && Array.isArray(store.storePermissions))
      storeV1.access_permissions = store.storePermissions.map(item => {
        if (item)
          return {
            allow: item.allow,
            id: item.id,
            resource: item.resource.name,
            store_cip: item.storeId,
          };
      });
    delete store.storePermissions;
    if (store.clusters) {
      storeV1.cluster = store.clusters;
      storeV1.cluster.descr = store.clusters.name;
      delete storeV1.cluster.name;
      delete store.clusters;
    }
    // const owner: any = store.owner;
    const owner: any =
      store.users && Array.isArray(store.users) ? store.users[0] : store.owner;
    delete store.users;
    if (owner) {
      owner.lst_name = owner.lastName;
      owner.fst_name = owner.lastName;
      owner.phone_num = owner.phone;
      owner.store_cip = owner.store_id;
      owner.role = owner.userRoleId === 1 ? 'admin' : 'client';
    }

    storeV1.owner = owner;
    return { ...store, ...storeV1 };
  }
}
