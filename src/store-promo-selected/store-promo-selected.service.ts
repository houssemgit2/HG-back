import { StorePromoSelected } from './../entities/StorePromoSelected';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, In, Not } from 'typeorm';
import { PROMO_TYPES } from './../../libs/pdf-promo-generator/src/consts';

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
        ids: promos.map(prm => prm.id),
      })
      .andWhere('sps.store_id = : store_id', storeId)
      .andWhere('month = :month', { month })
      .andWhere('year = :year', { year })
      .execute();
    return Promise.all(
      promos.map(promo => {
        let priceRef = 0;
        if (promo.micro_type === PROMO_TYPES.FIXED_PRICE) {
          priceRef = promo.price || 0;
        }
        const promoId = promo.id;
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
}
