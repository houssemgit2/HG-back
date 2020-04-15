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
    let queryDateOptions;
    if (filter.startDate && filter.endDate) {
      console.log('startDate', filter.startDate);
      console.log('endDate', filter.endDate);
      queryDateOptions = [
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
    }
    // if (filter.clusters) {
    //   const clusterConditionList = [];
    //   clusters.forEach(clusterID => {
    //     const clusterObj = {};
    //     clusterObj[clusterID] = 1;
    //     clusterConditionList.push(clusterObj);
    //   });
    //   queryConditions.push({ [Op.or]: clusterConditionList });
    // }
    if (filter.cluster) console.log(queryDateOptions);

    //      const queryOptions = {};
    try {
      //       if(filter.startDate&& filter.endDate){
      // test=[

      // ]
      //       }

      //       if(filter.offerAvantageClient){

      //       }

      return await this.promoRepository
        .createQueryBuilder('p')
        .leftJoin('promo_cluster', 'cluster', 'cluster.promo_id = p.id')
        .where(queryDateOptions)
        // .andWhere('cluster.cluster_id IN (:...clusters)', {
        //   clusters: [1, 2],
        // })
        .getMany();
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
