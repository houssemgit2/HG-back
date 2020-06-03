/* eslint-disable @typescript-eslint/camelcase */
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StorePermission } from '../entities/StorePermission';
import { getRepository } from 'typeorm';
import { Resource } from 'src/entities/Resource';
import { BadRequestException } from '@nestjs/common';
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
  async getResourceId(targetResource: string): Promise<number> {
    const resources = await getRepository(Resource).find();
    const resource = resources.find(res => res.name === targetResource);
    if (!resource)
      throw new BadRequestException(
        `${targetResource} is not defined as a resource, please choose an existence resource`,
      );
    return resource.id;
  }
}
