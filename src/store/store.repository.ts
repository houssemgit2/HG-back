import { Repository, EntityRepository, Connection } from 'typeorm';
import { Store } from '../entities/Store';
import { InjectRepository } from '@nestjs/typeorm';
import { AddStoreDto } from './dto/add-store.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UserCredentialDto } from '../user/dto/user.dto';
import { UserRepository } from 'src/auth/user.repository';
import { GetStoreDto } from './dto/get-store.dto';
import { User } from '../entities/User';
import { Cluster } from '../entities/Cluster';

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
    /**
  set to false to not load the join relation automatically
 */
    // queryOption.loadEagerRelations = true;
    // queryOption.join = {
    //   alias: 'User',
    //   leftJoinAndSelect: {
    //     firstName: 'user.first_name',
    //     lastName: 'user.last_name',
    //     email: 'user.email',
    //     phone: 'user.phone',
    //     address: 'user.address',
    //   },
    // };
    // queryOption.relations = [User, Cluster];
    try {
      const result: Store[] = await this.find(queryOption);
      return result;
    } catch (e) {
      return e;
    }
  }

  async add(addStore: AddStoreDto, owner: UserCredentialDto): Promise<any> {
    //const userAuth = this.userRepoFunction.generateSaltPassword(owner.password);

    // const user: UserCredentialDto = { ...owner, ...userAuth };
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction');
    try {
      const store = await queryRunner.manager.save(addStore);
      // owner.storeId = store.id;
      console.log(store);
      const userIn = await queryRunner.manager.save(owner);
      console.log(userIn);
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('failed to finish transaction');
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      return { data: 'store added successfully' };
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
  async update(store: Store) {
    return await this.storeRepository.update(store.id, store);
  }

  async delete(id) {
    return await this.storeRepository.delete(id);
  }
}
