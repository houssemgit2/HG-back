/* eslint-disable @typescript-eslint/camelcase */
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StorePermission } from '../entities/StorePermission';

@EntityRepository(StorePermission)
export class StorePermissionRepository extends Repository<StorePermission> {
  constructor(
    @InjectRepository(StorePermission)
    private storePermissionRepository: Repository<StorePermission>,
  ) {
    super();
  }
  async getAll(): Promise<StorePermission[]> {
    return await this.find();
  }
}
