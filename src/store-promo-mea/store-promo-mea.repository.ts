import { Repository, EntityRepository } from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

@EntityRepository(StorePromoMea)
export class StorePromoMeaRepository extends Repository<StorePromoMea> {
  constructor(private storePromoMeaRepository: Repository<StorePromoMea>) {
    super();
  }
  async findAll() {
    return await this.find({ relations: [] });
  }
  async rejectPromo(queryCondition: any, toSetObject: any) {
    const updateResult = await this.update(queryCondition, toSetObject);
    await this.decrement(queryCondition, 'rejectionNumber', 1);
    await this.update(
      { state: 'REJECTED', rejectionNumber: 0 },
      { state: 'OPERATION_REFUSED' },
    );
    return updateResult;
  }
}
