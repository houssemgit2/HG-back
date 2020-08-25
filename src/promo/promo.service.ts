import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoType } from '../entities/PromoType';
// import { PromoType } from 'src/entities/PromoType';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
// Entity
import { Promo } from './../entities/Promo';
import { SaveGeneralPromoDto } from './dto/save-general-prams.dto';
import { PromoCluster } from '../entities/PromoCluster';
import { groupCollapsed } from 'console';
// DTO
@Injectable()
export class PromoService {
  saveOpAchat(promoId: number, body: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Promo)
    private promoRepository: Repository<Promo>,
    @InjectRepository(PromoType)
    private promoTypeRepository: Repository<PromoType>,

    @InjectRepository(PromoCluster)
    private promoClusterRepository: Repository<PromoCluster>,
  ) {}
  async createPromoType(typeIds: number[]) {
    let promoId: number;
    return this.promoRepository
      .save({ gammeId: null, status: 0 })
      .then(promo => {
        promoId = promo.id;
        const promoTypes = typeIds.map(item => ({
          operationTypeId: item,
          promoId: promo.id,
        }));
        return this.promoTypeRepository.save(promoTypes).catch(e => {
          throw new InternalServerErrorException(e);
        });
      })
      .catch(e => {
        throw new InternalServerErrorException(e);
      });
    // console.log('test   ', test);
    // const test2 = await this.promoTypeRepository.find({ where: { promoId } });
    // console.log('test2  ', test2);
    // return test2;
  }
  async getPromoType(promoId: number) {
    try {
      return await this.promoRepository.findOne(promoId);
      // .createQueryBuilder('promo')
      // .leftJoinAndSelect(
      //   'promo.promoType',
      //   'promoType',
      //   'promoType.promoId=promo.id',
      // )
      // .leftJoinAndSelect(
      //   'promoType.operationType',
      //   'operationType',
      //   'promoType.operationTypeId=operationType.id',
      // )
      // .where('promo.id = :promoId', { promoId })
      // .getOne();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async duplicatePromo(promoId: number) {
    const promo = await this.promoRepository.findOne(promoId, {
      relations: [
        'promoType',
        'remunerations',
        'storePromoMeas',
        'promoClusters',
        'promoAchat',
        'promoConso',
        'promoMea',
      ],
    });
    delete promo.id;
    delete promo.createdAt;
    delete promo.updatedAt;
    return await promo.save();
  }
  async getAll(filter): Promise<Promo[]> {
    const sqlQuery = this.promoRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect(
        'p.promoClusters',
        'promoCluster',
        'promoCluster.promo_id = p.id',
      )
      .leftJoinAndSelect(
        'promoCluster.cluster',
        'c',
        'c.id = promoCluster.cluster_id',
      )
      .leftJoin('promo_type', 'promoType', 'promoType.promo_id = p.id')
      .leftJoin('operation_type', 't', 't.id = promoType.operation_type_id')
      .leftJoinAndSelect('p.gamme', 'gamme');
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
      sqlQuery.andWhere('c.name IN (:...clusters)', {
        clusters: JSON.parse(filter.clusters),
      });
    }
    if (filter.type) {
      filter.type.split(',').forEach(val => {
        sqlQuery.orWhere('t.name like :name', {
          name: '%' + val + '%',
        });
      });
    }
    if (filter.perPage && filter.page) {
      sqlQuery.skip(filter.perPage * (filter.page - 1)).take(filter.perPage);
    }
    try {
      return await sqlQuery.getMany();
    } catch (err) {
      return err;
    }
  }

  async saveGeneralParams(
    promoId: number,
    body: SaveGeneralPromoDto,
  ): Promise<Promo> {
    const promo = new Promo();
    promo.id = promoId;
    promo.gammeId = body.gamme_id;
    promo.endDate = body.end_date;
    promo.startDate = body.start_date;
    const promoClusters: PromoCluster[] = body.clusters_id.map(item => {
      const promoCluster = new PromoCluster();
      promoCluster.promoId = promoId;
      promoCluster.clusterId = item;
      return promoCluster;
    });
    // groups  : concerned_gamme: all,some,exclude
    // groups  : concerned_product: without_lot,with_lot
    if (body.concerned === 'gamme') {
      if (body.option_product === 'some') promo.productsIdIn = body.products_in;
      if (body.option_product === 'exclude')
        promo.productsIdOut = body.products_out;
    } else if (body.concerned === 'product') {
      promo.productsIdIn = [body.product_id];
      //  ean = body.ean
      // body.value_unit_capacity  // todo where to save
      // body.lot
      // if(body.lot) body.qnt_product_lot
    }
    try {
      await this.promoClusterRepository.save(promoClusters);
      return await this.promoRepository.save(promo);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async delete(id: string) {
    try {
      return await this.promoRepository.delete(id);
    } catch (err) {
      return err;
    }
  }
}
