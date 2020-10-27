/* eslint-disable @typescript-eslint/camelcase */
import {
  Repository,
  EntityRepository,
  Connection,
  getConnection,
  FindManyOptions,
} from 'typeorm';
import { Store } from '../entities/Store';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from '../entities/User';
import { StorePermission } from '../entities/StorePermission';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  logger = new Logger('Store Repository');
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private connection: Connection,
  ) {
    super();
  }
  async getOne(cip: number) {
    this.logger.debug(`fetching store cip where cip = ${cip}`);
    return await this.createQueryBuilder('store')
      .leftJoinAndSelect(
        'store.users',
        'owner',
        'owner.store_id=store.cip && is_owner=true',
      )
      .leftJoinAndSelect(
        'store.clusters',
        'clusters',
        'clusters.id=store.cluster_id',
      )
      .leftJoinAndSelect('store.storePermissions', 'storePermissions')
      .leftJoinAndSelect('storePermissions.resource', 'resource')
      .where('store.cip = :cip', { cip })
      .getOne();
  }
  async findAll(filter: PaginationDto): Promise<any> {
    try {
      const query = this.createQueryBuilder('store')
        .leftJoinAndSelect(
          'store.owner',
          'owner',
          'owner.store_id=store.cip && is_owner=true',
        )
        .leftJoinAndSelect(
          'store.clusters',
          'clusters',
          'clusters.id=store.cluster_id',
        );

      if (filter.perPage && filter.page) {
        query.skip(filter.perPage * (filter.page - 1)).take(filter.perPage);
      }
      const result = await query.getMany();
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
  ): Promise<Store> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction');
    // let store: any;
    try {
      owner.isOwner = 1;
      const addedOwner = await queryRunner.manager.save(owner);
      console.log('addedOwner', addedOwner);
      const newStore = await queryRunner.manager.save(store);
      console.log('newStore', newStore);
      if (update && permissions)
        await queryRunner.manager.delete(StorePermission, {
          storeId: store.cip,
        });
      if (permissions) await queryRunner.manager.save(permissions);
      await queryRunner.commitTransaction();
      return newStore;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'failed to finish transaction' + err,
      );
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
  async get(cip: number): Promise<Store> {
    try {
      return await this.storeRepository.findOne(
        { cip },
        { relations: ['owner'] },
      );
    } catch (e) {
      console.error(`could not find one store by cip`);
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
    let newStore;
    try {
      newStore = await queryRunner.manager.save(store);
      if (owner && owner.id)
        await queryRunner.manager.update(User, owner.id, owner);
      if (permissions)
        await queryRunner.manager.delete(StorePermission, {
          storeId: store.cip,
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
      return newStore;
    }
  }

  async deleteStore(cip: number) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction');
    // let store: any;
    try {
      await queryRunner.manager.delete(StorePermission, {
        storeId: cip,
      });

      await queryRunner.manager.delete(User, { storeId: cip });

      const deletedStore = await queryRunner.manager.delete(Store, {
        cip,
      });
      await queryRunner.commitTransaction();
      return deletedStore;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('failed to finish transaction');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
