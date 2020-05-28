import {
  FindConditions,
  Repository,
  EntityRepository,
  MoreThan,
} from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';

@EntityRepository(StorePromoMea)
export class StorePromoMeaRepository extends Repository<StorePromoMea> {
  constructor(private storePromoMeaRepository: Repository<StorePromoMea>) {
    super();
  }
  async findAll() {
    return await this.find({ relations: [] });
  }
  async rejectPromo(
    queryCondition: FindConditions<StorePromoMea>,
    toSetObject: any,
  ) {
    if (!queryCondition.state) queryCondition.rejectionNumber = MoreThan(0);
    const updateResult = await this.update(queryCondition, toSetObject);
    await this.decrement(queryCondition, 'rejectionNumber', 1);
    await this.update(
      { state: 'REJECTED', rejectionNumber: 0 },
      { state: 'OPERATION_REFUSED' },
    );
    return updateResult;
  }
}
