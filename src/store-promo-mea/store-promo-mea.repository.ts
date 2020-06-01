import {
  FindConditions,
  Repository,
  EntityRepository,
  MoreThan,
} from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Store } from 'src/entities/Store';

@EntityRepository(StorePromoMea)
export class StorePromoMeaRepository extends Repository<StorePromoMea> {
  constructor(private storePromoMeaRepository: Repository<StorePromoMea>) {
    super();
  }
  logger = new Logger('PromoMea Repository');
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
  async findPromoMeaByIdPromoStore(
    promoId?: number,
    clusterId?: number,
    storeId?: number,
  ) {
    if (!promoId && !clusterId && !storeId)
      throw new Error('you must provide a promo_id or store_id');
    const searchQuery = getConnection()
      .createQueryBuilder()
      .select('store.id', 'storeId')
      .from(Store, 'store')
      // .innerJoinAndSelect('store.clusters', 'clusters')
      .innerJoin('store.clusters', 'clusters')
      .innerJoin('clusters.promoClusters', 'promoClusters')
      .addSelect('promoClusters.promoId', 'promoId');
    try {
      if (storeId) {
        const byStore = searchQuery.where('store.id = :storeId', {
          storeId,
        });
        return await byStore.getRawMany();
      } else if (clusterId) {
        const byCluster = searchQuery.where('store.clusterId = :id', {
          id: clusterId,
        });
        return await byCluster.getRawMany();
      } else {
        const byPromo = searchQuery.where('promoClusters.promoId = :promoId', {
          promoId,
        });
        return await byPromo.getRawMany();
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
