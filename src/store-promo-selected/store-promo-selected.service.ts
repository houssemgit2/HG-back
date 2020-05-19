import { StorePromoSelected } from './../entities/StorePromoSelected';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, In, Not } from 'typeorm';
import { PROMO_TYPES } from './../../libs/pdf-promo-generator/src/consts';
import { _ } from 'lodash';

const groupBy = require('group-array-items').default;

@Injectable()
export class StorePromoSelectedService {
  constructor(
    @InjectRepository(StorePromoSelected)
    private storePromoSelectedRepository: Repository<StorePromoSelected>,
  ) {}
  async savedPromos(storeId, month, year, promos) {
    await this.storePromoSelectedRepository
      .createQueryBuilder()
      .delete()
      .where('promo_id NOT IN (:...ids)', {
        ids: promos.map(prm => prm.ID),
      })
      // eslint-disable-next-line @typescript-eslint/camelcase
      .andWhere('store_id = :store_id', { store_id: storeId })
      .andWhere('month = :month', { month })
      .andWhere('year = :year', { year })
      .execute();
    return Promise.all(
      promos.map(promo => {
        let priceRef = 0;
        if (promo.micro_type === PROMO_TYPES.FIXED_PRICE) {
          priceRef = promo.price || 0;
        }
        const promoId = promo.ID;
        return this.storePromoSelectedRepository.save({
          promoId,
          storeId,
          month,
          year,
          printConfig: [
            {
              orientation: 'landscape',
              format: 'A7',
              copies: 1,
              priceRef,
              mention1: promo.mention1 || '',
              mention2: promo.mention2 || '',
            },
          ],
        });
      }),
    );
  }
  async savePrintConfig(storeId, month, year, promos) {
    const groupedPromos = groupBy(promos, {
      groupBy: 'ID',
      childElement: 'print_config',
    });
    // this variable is used to record updatedPromos IDs so that we can clean up deleted promos from the db
    const currentMonthPromos = [];

    await Promise.all(
      groupedPromos.map(promo => {
        currentMonthPromos.push(promo.ID);
        const printConfgJson = promo.print_config.map(config =>
          _.pick(config, [
            'priceRef',
            'orientation',
            'format',
            'copies',
            'mention1',
            'mention2',
          ]),
        );
        return this.storePromoSelectedRepository.query(
          'INSERT INTO `store_promo_selected` (`promo_id`, `store_id`, `year`, `month`, `print_config`) VALUES (' +
            promo.ID +
            ',' +
            storeId +
            ',' +
            month +
            ',' +
            year +
            ',' +
            JSON.stringify(JSON.stringify(printConfgJson)) +
            ') ON DUPLICATE KEY UPDATE promo_id=promo_id',
        );
      }),
    );
    return (
      this.storePromoSelectedRepository
        .createQueryBuilder()
        .delete()
        .where('promo_id NOT IN (:...ids)', {
          ids: currentMonthPromos,
        })
        // eslint-disable-next-line @typescript-eslint/camelcase
        .andWhere('store_id = :store_id', { store_id: storeId })
        .andWhere('month = :month', { month })
        .andWhere('year = :year', { year })
        .execute()
    );
  }
  async list(storeId, month, year, includePromoDetails) {
    console.log('ok');
  }
}
