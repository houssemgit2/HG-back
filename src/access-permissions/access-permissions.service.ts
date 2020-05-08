/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, BadRequestException } from '@nestjs/common';
import { StorePermission } from '../entities/StorePermission';
import { StorePermissionRepository } from './access-permissions.repository';
import { PaginationDto } from 'src/store/dto/pagination.dto';
import { CreateAccessPermissionDto } from './dto/create.dto';
import { UpdateAccessPermissionDto } from './dto/update.dto';

@Injectable()
export class AccessPermissionsService {
  constructor(private storePermissionRepository: StorePermissionRepository) {}
  async remove(storeId: number): Promise<any> {
    return await this.storePermissionRepository.delete(storeId);
  }
  async update(
    storeId: number,
    updateAccessPermissionDto: UpdateAccessPermissionDto,
  ): Promise<StorePermission> {
    const { allow, resource_id } = updateAccessPermissionDto;
    try {
      const storePermissionToUpdate = await this.storePermissionRepository.findOne(
        {
          where: { storeId, resourceId: resource_id },
        },
      );
      if (storePermissionToUpdate) {
        storePermissionToUpdate.allow = allow;
        return await this.storePermissionRepository.save(
          storePermissionToUpdate,
        );
      } else {
        throw new BadRequestException(
          `the store id:${storeId} has no access registered for the resource ${resource_id}`,
        );
      }
    } catch (e) {
      return e;
    }
  }
  async getByStore(
    resource_id: number,
    storeId: number,
  ): Promise<StorePermission[]> {
    try {
      if (resource_id && storeId) {
        const resourceId: number = resource_id;
        return await this.storePermissionRepository.find({
          where: { storeId, resourceId },
        });
      }
      if (storeId)
        return await this.storePermissionRepository.find({
          where: { storeId },
        });
    } catch (e) {
      return e;
    }
  }
  async create(
    storePermission: CreateAccessPermissionDto,
  ): Promise<StorePermission> {
    const { resource_id, allow, store_cip } = storePermission;
    const oldStorePermission = await this.storePermissionRepository.findOne({
      where: { storeId: store_cip, resourceId: resource_id },
    });
    const newStorePermission = new StorePermission();
    newStorePermission.resourceId = resource_id;
    newStorePermission.allow = allow; // save allow as boolean todo: fix this
    newStorePermission.storeId = store_cip;
    if (oldStorePermission) newStorePermission.id = oldStorePermission.id;
    return await this.storePermissionRepository.save(newStorePermission);
  }
  async listAll(filter: PaginationDto): Promise<StorePermission[]> {
    const queryOption: any = {};
    if (filter.perPage && filter.page) {
      queryOption.skip = filter.perPage * (filter.page - 1);
      queryOption.take = filter.perPage;
    }
    try {
      const result: StorePermission[] = await this.storePermissionRepository.find(
        queryOption,
      );
      return result;
    } catch (e) {
      return e;
    }
  }
}
