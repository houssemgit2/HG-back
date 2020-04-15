import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
// Entity
import { Promo } from './../entities/Promo';
// DTO
import { GetPromoDto } from './dto/get-promo.dto';
@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo)
    private promoRepository: Repository<Promo>,
  ) {}

  async getAll(filter): Promise<Promo[]> {
    const sqlQuery = this.promoRepository
      .createQueryBuilder('p')
      .leftJoin('promo_cluster', 'promoCluster', 'promoCluster.promo_id = p.id')
      .leftJoin('cluster', 'c', 'c.id = promoCluster.cluster_id')
      .leftJoin('promo_type', 'promoType', 'promoType.promo_id = p.id')
      .leftJoin('operation_type', 't', 't.id = promoType.operation_type_id');
    if (filter.startDate && filter.endDate) {
      const queryDateOptions = [
        {
          startDate: LessThan(filter.startDate),
        },
        {
          endDate: MoreThan(filter.startDate),
        },
        {
          startDate: Between(filter.startDate, filter.endDate),

          endDate: Between(filter.startDate, filter.endDate),
        },
      ];

      sqlQuery.where(queryDateOptions);
    }
    if (filter.clusters) {
      console.log('clusters', filter.clusters);
      sqlQuery.andWhere('c.name IN (:...clusters)', {
        clusters: ['cluster1'],
      });
    }
    if (filter.type) {
      sqlQuery.andWhere('t.name like :name', {
        name: '%' + filter.type + '%',
      });
    }
    try {
      return await sqlQuery.getMany();
      // .find({
      //   where: filter,
      //   relations: ['promoClusters'],
      // })
    } catch (err) {
      return err;
    }
  }

  //   async findById(id: string): Promise<Promo> {
  //     try {
  //       return await this.promoRepository.findOneById(id);
  //     } catch (err) {
  //       return err;
  //     }
  //   }

  async delete(id: string) {
    try {
      return await this.promoRepository.delete(id);
    } catch (err) {
      return err;
    }
  }
}
