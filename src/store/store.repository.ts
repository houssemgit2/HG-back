import { Repository, EntityRepository } from 'typeorm';
import { Store } from '../entities/Store';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {
    super();
  }
  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find();
  }

  //   async create(store: Store): Promise<Store> {
  //     return await this.storeRepository.save(store);
  //   }

  async update(store: Store) {
    return await this.storeRepository.update(store.id, store);
  }

  async delete(id) {
    return await this.storeRepository.delete(id);
  }
}
