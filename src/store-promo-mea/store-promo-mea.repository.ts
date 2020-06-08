import {
  FindConditions,
  Repository,
  EntityRepository,
  MoreThan,
  Transaction,
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
      throw new Error('you must provide a promo_id or store_id or clusterId');
    const searchQuery = getConnection()
      .createQueryBuilder()
      .select('store.cip', 'storeId')
      .from(Store, 'store')
      // .innerJoinAndSelect('store.clusters', 'clusters')
      .innerJoin('store.clusters', 'clusters')
      .innerJoin('clusters.promoClusters', 'promoClusters')
      .innerJoin('promoClusters.promo', 'promo')
      .innerJoin('promo.promoType', 'promoType')
      .innerJoin('promoType.operationType', 'operationType')
      .addSelect('promoClusters.promoId', 'promoId')
      .where("operationType.name like '%MEA%'");
    try {
      if (storeId) {
        const byStore = searchQuery.where('store.cip = :storeId', {
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

  @Transaction()
  async removeNotConcerned(
    promosIds: number | number[],
    storeIds: number[] | number,
  ) {
    try {
      if (Array.isArray(promosIds) && Array.isArray(storeIds))
        throw new InternalServerErrorException(
          `promosIds or storeIds must be not array,`,
        );
      let dltQuery = this.createQueryBuilder().delete();
      if (Array.isArray(promosIds))
        // when store cluster is updated
        dltQuery = dltQuery
          .where('promo_id NOT IN (:...ids)', {
            ids: promosIds,
          })
          .andWhere('store_id = :storeId', { storeId: storeIds });
      else if (Array.isArray(storeIds))
        // when promo cluster is updated
        dltQuery = dltQuery
          .where('store_id NOT IN (:...ids)', {
            ids: storeIds,
          })
          .andWhere('promo_id = :promoId', { promoId: promosIds });
      return await dltQuery.execute();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Transaction()
  async afterPromoClusterChanged(promoId: number) {
    const promoStoreList: StorePromoMea[] = await this.findPromoMeaByIdPromoStore(
      promoId,
    );
    this.logger.log(`new promoMea ${promoStoreList.toString()}`);
    const storesIds: number[] = promoStoreList.map(promo => promo.storeId);
    await this.removeNotConcerned(promoId, storesIds);
    const concernedStore: {
      storeId: number;
    }[] = await this.find({
      select: ['storeId'],
      where: { promoId },
    });
    const promoStoreToInsert: StorePromoMea[] = promoStoreList.filter(promo => {
      return !concernedStore.some(mea => mea.storeId === promo.storeId);
    });
    // todo remove this and make the promoId and storeId a primary key after removing the id in StorePromoMea
    // and use save with onDuplicate : ignore
    return await this.save(promoStoreToInsert);
  }
  async afterStoreClusterChanged(storeId: number) {
    const promoStoreList: StorePromoMea[] = await this.findPromoMeaByIdPromoStore(
      null,
      null,
      storeId,
    );
    this.logger.log(`new promoMea`); // ${promoStoreList.toString()}`);
    console.log(promoStoreList);
    const promosIds: number[] = promoStoreList.map(promo => promo.promoId);
    await this.removeNotConcerned(promosIds, storeId);
    const concernedStore: {
      promoId: number;
    }[] = await this.find({
      select: ['promoId'],
      where: { storeId },
    });
    const promoStoreToInsert: StorePromoMea[] = promoStoreList.filter(promo => {
      return !concernedStore.some(mea => mea.promoId === promo.promoId);
    });
    this.logger.log(` promoMea to insert `); //${promoStoreToInsert.toString()}`);
    console.log(promoStoreToInsert);
    // todo remove this and make the promoId and storeId a primary key after removing the id in StorePromoMea
    // and use save with onDuplicate : ignore
    return await this.save(promoStoreToInsert);
  }
}
