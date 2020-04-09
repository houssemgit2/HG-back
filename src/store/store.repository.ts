import { Repository, EntityRepository } from 'typeorm';
import { Store } from '../entities/Store';
import { InjectRepository } from '@nestjs/typeorm';
import { AddStoreDto } from './dto/add-store.dto';
import { InternalServerErrorException } from '@nestjs/common';

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

  async add(addStore: AddStoreDto): Promise<Store> {
    const store = new Store();
    store.cip = addStore.cip;
    store.name = addStore.name;
    store.clusterId = addStore.cluster_id;
    return await this.storeRepository.save(store);
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
