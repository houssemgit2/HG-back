/* eslint-disable @typescript-eslint/camelcase */
import {
  Repository,
  EntityRepository,
  Connection,
  getConnection,
} from 'typeorm';
import { Store } from '../entities/Store';
import { InjectRepository } from '@nestjs/typeorm';
import { AddStoreDto } from './dto/add-store.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UserCredentialDto } from '../user/dto/user.dto';
import { UserRepository } from 'src/auth/user.repository';
import { GetStoreDto } from './dto/get-store.dto';
import { User } from '../entities/User';
import { Cluster } from '../entities/Cluster';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { StorePermission } from '../entities/StorePermission';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private connection: Connection,
  ) {
    super();
  }
  async findAll(filter: GetStoreDto): Promise<any> {
    const queryOption: any = {};
    if (filter.perPage && filter.page) {
      queryOption.skip = filter.perPage * (filter.page - 1);
      queryOption.take = filter.perPage;
    }
    try {
      const result: Store[] = await this.find(queryOption);
      return result;
    } catch (e) {
      return e;
    }
  }

  async add(
    store: Store,
    owner: User,
    permissions: StorePermission[],
    update: boolean,
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction');
    // let store: any;
    try {
      console.log('store---->', store);
      const newStroe = await queryRunner.manager.save(store);
      // owner.storeId = store.id;
      console.log(newStroe);
      const userIn = await queryRunner.manager.save(owner);
      // console.log(userIn);
      if (update && permissions)
        await queryRunner.manager.delete(StorePermission, {
          storeId: store.id,
        });
      if (permissions) await queryRunner.manager.save(permissions);
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('failed to finish transaction');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      console.log(store, 'added store-------------------*');
      return store;
    }
  }

  async get(id: number): Promise<Store> {
    try {
      return await this.storeRepository.findOne({ id });
    } catch (e) {
      console.error(`could not find one store by id`);
      throw new InternalServerErrorException(e);
    }
  }
  async edit(
    store: Store,
    owner: User,
    permissions: StorePermission[],
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction');
    // let store: any;
    try {
      console.log('store---->', store);
      const newStroe = await queryRunner.manager.update(Store, store.id, store);
      // owner.storeId = store.id;
      console.log(newStroe);
      const userIn = await queryRunner.manager.update(User, owner.id, owner);
      // console.log(userIn);
      await queryRunner.manager.save(permissions);
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('failed to finish transaction');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      console.log(store, 'added store-------------------*');
      return store;
    }
  }

  async delete(id) {
    return await this.storeRepository.delete(id);
  }
}
