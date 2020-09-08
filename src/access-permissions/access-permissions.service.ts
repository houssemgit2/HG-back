import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    const { allow, resource } = updateAccessPermissionDto;
    const resourceId = await this.storePermissionRepository.getResourceId(
      resource,
    );

    const storePermissionToUpdate = await this.storePermissionRepository.findOne(
      {
        where: { storeId, resourceId },
      },
    );
    if (storePermissionToUpdate) {
      storePermissionToUpdate.allow = allow;
      return await this.storePermissionRepository.save(storePermissionToUpdate);
    } else {
      throw new BadRequestException(
        `the store id:${storeId} has no access registered for the resource ${resource}`,
      );
    }
  }
  async getByStore(
    resourceId: number,
    storeId: number,
  ): Promise<StorePermission[]> {
    try {
      const query = this.storePermissionRepository
        .createQueryBuilder('ap')
        .leftJoinAndSelect('ap.resource', 'rs')
        .select(['store_id', 'allow', 'resource_id', 'rs.name as resource']) // old endpoint has store_cip
        .where('ap.store_id = :storeId', { storeId });
      if (resourceId)
        return await query
          .andWhere('ap.resource_id = :resourceId', {
            resourceId,
          })
          .getMany();
      return await query.getRawMany();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async create(
    storePermission: CreateAccessPermissionDto,
  ): Promise<StorePermission> {
    const { resource, allow, store_cip: storeId } = storePermission;
    const resourceId = await this.storePermissionRepository.getResourceId(
      resource,
    ); //.then(id => id);
    const oldStorePermission = await this.storePermissionRepository.findOne({
      where: { storeId, resourceId },
    });
    const newStorePermission = new StorePermission();
    newStorePermission.resourceId = resourceId;
    newStorePermission.allow = allow; // save allow as boolean todo: fix this
    newStorePermission.storeId = storeId;
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

// todo find solution for the multiple addselect
