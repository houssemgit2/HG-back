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
import { Store } from '../entities/Store';
import { PROMO_STATE } from 'src/config/enum-types';

@EntityRepository(StorePromoMea)
export class StorePromoMeaRepository extends Repository<StorePromoMea> {
  constructor(private storePromoMeaRepository: Repository<StorePromoMea>) {
    super();
  }
  logger = new Logger('PromoMea Repository');

  async rejectPromo(
    queryCondition: FindConditions<StorePromoMea>,
    toSetObject: any,
  ) {
    if (!queryCondition.state) queryCondition.rejectionNumber = MoreThan(0);
    const updateResult = await this.update(queryCondition, toSetObject);
    await this.decrement(queryCondition, 'rejectionNumber', 1);
    await this.update(
      { state: PROMO_STATE.REJECTED, rejectionNumber: 0 },
      { state: PROMO_STATE.OPERATION_REFUSED },
    );
    return updateResult;
  }
  async findPromoMeaByIdPromoStore(
    promoId?: number,
    clusterId?: number,
    storeId?: number,
  ) {
    this.logger.debug(`fetching store promo mea... `);
    if (!promoId && !clusterId && !storeId)
      throw new Error('you must provide a promo_id or store_id or clusterId');
    const searchQuery = getConnection()
      .createQueryBuilder()
      .select(['store.cip as storeId', 'promoClusters.promoId as promoId'])
      .from(Store, 'store')
      .leftJoin('store.clusters', 'clusters')
      .leftJoin('clusters.promoClusters', 'promoClusters')
      .leftJoin('promoClusters.promo', 'promo')
      .leftJoin('promo.promoType', 'promoType')
      .leftJoin('promoType.operationType', 'operationType')
      .where("operationType.name like '%MEA%'")
      .andWhere('promo.status_id=1');
    try {
      if (storeId) {
        this.logger.verbose('fetching store concerned for the store' + storeId);
        const byStore = searchQuery.andWhere('store.cip = :cip', {
          cip: storeId,
        });
        const stores = await byStore.getRawMany();
        console.log('stores', stores);
        return stores;
      } else if (clusterId) {
        const byCluster = searchQuery.andWhere('store.clusterId = :id', {
          id: clusterId,
        });
        return await byCluster.getRawMany();
      } else {
        const byPromo = searchQuery.andWhere(
          'promoClusters.promoId = :promoId',
          {
            promoId,
          },
        );
        return await byPromo.getRawMany();
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  // @Transaction()
  async removeNotConcerned(
    promosIds: number | number[],
    storeIds: number[] | number,
  ) {
    try {
      // remove store promo mea for a specific promo or for specific store
      if (Array.isArray(promosIds) && Array.isArray(storeIds))
        throw new InternalServerErrorException(
          `promosIds or storeIds must be not array,`,
        );
      let dltQuery = this.createQueryBuilder().delete();
      if (Array.isArray(promosIds)) {
        this.logger.warn('when store cluster is updated');
        dltQuery = dltQuery.where('store_id = :storeId', { storeId: storeIds });
        if (promosIds.length)
          dltQuery = dltQuery.where('store_id NOT IN (:...ids)', {
            ids: storeIds,
          });
        if (promosIds.length)
          dltQuery = dltQuery.where('promo_id NOT IN (:...ids)', {
            ids: promosIds,
          });
      } else if (Array.isArray(storeIds)) {
        this.logger.warn(' // when promo cluster is updated');
        dltQuery = dltQuery.where('promo_id = :promoId', {
          promoId: promosIds,
        });
        if (storeIds.length)
          dltQuery = dltQuery.where('store_id NOT IN (:...ids)', {
            ids: storeIds,
          });
      } else return null;
      return await dltQuery.execute(); // TODO make sure we are allowed to delete not concerned store promo mea
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  // @Transaction()
  async afterPromoClusterChanged(promoId: number) {
    try {
      this.logger.debug('start checking promo mea in new cluster');
      const promoStoreList: StorePromoMea[] = await this.findPromoMeaByIdPromoStore(
        promoId,
      );
      this.logger.debug('start checking promo mea in new cluster');
      console.log(promoStoreList);
      const concernedStores: {
        storeId: number;
      }[] = await this.find({
        select: ['storeId'],
        where: { promoId },
      });
      this.logger.verbose(
        `store already concerned for the promo ${promoId} are ${concernedStores
          .map(item => item.storeId)
          .toString()} `,
      );
      console.log(concernedStores);
      const promoStoreToInsert: StorePromoMea[] = promoStoreList.filter(
        promo => {
          return !concernedStores.some(mea => mea.storeId === promo.storeId);
        },
      );
      this.logger.verbose('store to insert');
      console.log(promoStoreToInsert);
      const storeToRemove = concernedStores.filter(promo => {
        return !promoStoreList.some(mea => mea.storeId === promo.storeId);
      });
      this.logger.debug('store to remove');
      console.error(storeToRemove);
      if (storeToRemove.length)
        await this.createQueryBuilder()
          .delete()
          .where('store_id  IN (:...ids)', {
            ids: storeToRemove.map(item => item.storeId),
          })
          .andWhere('promo_id = :promoId', { promoId })
          .execute();
      else
        this.logger.warn(`promo to remove length is ${storeToRemove.length}`);
      return await this.save(promoStoreToInsert);
    } catch (e) {
      console.log(Object.keys(e));
      throw new InternalServerErrorException(e);
    }
  }
  async afterStoreClusterChanged(storeId: number) {
    try {
      const promoStoreList: StorePromoMea[] = await this.findPromoMeaByIdPromoStore(
        null,
        null,
        storeId,
      );
      const concernedPromos: {
        promoId: number;
      }[] = await this.find({
        select: ['promoId'],
        where: { storeId },
      });
      const promoStoreToInsert: StorePromoMea[] = promoStoreList.filter(
        promo => {
          return !concernedPromos.some(mea => mea.promoId === promo.promoId);
        },
      );
      const promoToRemove = concernedPromos.filter(promo => {
        return !promoStoreList.some(mea => mea.promoId === promo.promoId);
      });
      if (promoToRemove.length)
        await this.createQueryBuilder()
          .delete()
          .where('promo_id  IN (:...ids)', {
            ids: promoToRemove.map(item => item.promoId),
          })
          .andWhere('store_id = :storeId', { storeId })
          .execute();
      else
        this.logger.warn(`promo to remove length is ${promoToRemove.length}`);
      // TODO  remove this and make the promoId and storeId a primary key after removing the id in StorePromoMea
      // and use save with onDuplicate : ignore
      return await this.save(promoStoreToInsert);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
