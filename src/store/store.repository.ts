import { Repository, EntityRepository, Connection } from 'typeorm';
import { Store } from '../entities/Store';
import { InjectRepository } from '@nestjs/typeorm';
import { AddStoreDto } from './dto/add-store.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { UserCredentialDto } from '../user/dto/user.dto';
import { User } from '../entities/User';
import { UserRepository } from 'src/auth/user.repository';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private connection: Connection,
    private userRepoFunction: UserRepository,
  ) {
    super();
  }
  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find();
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
      return { data: 'store added sccefully' };
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
