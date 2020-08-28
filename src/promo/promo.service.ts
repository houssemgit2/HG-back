import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoOperationType } from '../entities/PromoType';
// import { PromoType } from 'src/entities/PromoType';
import { Repository, LessThan, MoreThan, Between } from 'typeorm';
// Entity
import { Promo } from './../entities/Promo';
import { SaveGeneralPromoDto } from './dto/save-general-prams.dto';
import { PromoCluster } from '../entities/PromoCluster';
import { PromoAchat } from '../entities/PromoAchat';
import { PromoAchatDto } from './dto/promo.achat.dto';
import { PromoMea } from '../entities/PromoMea';
import { PromoMeaDto, PromoMeaEmplacementDto } from './dto/promo-mea.dto';
import { PromoMeaEmplacement } from '../entities/PromoMeaEmplacement';
import { RemunerationFixedDetailsDto } from './dto/remuneration.dto';
import { convertToCamelCase } from '../common/utils/helpers';
// DTO
@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo)
    private promoRepository: Repository<Promo>,
    @InjectRepository(PromoOperationType)
    private promoOperationTypeRepository: Repository<PromoOperationType>,

    @InjectRepository(PromoCluster)
    private promoClusterRepository: Repository<PromoCluster>,
    @InjectRepository(PromoAchat)
    private promoAchatRepository: Repository<PromoAchat>,
    @InjectRepository(PromoMea)
    private promoMeaRepository: Repository<PromoMea>,
    @InjectRepository(PromoMeaEmplacement)
    private promoMeaEmplacementRepository: Repository<PromoMeaEmplacement>,
  ) {}
  async saveMeaPromo(promoId: number, promo: PromoMeaDto): Promise<any> {
    // const promoMea = new PromoMea();
    // promoMea.promoId = promoId;
    // promoMea.hasEligibilityMinimumOrder = promo.has_eligibility_minimum_order;
    // if (promoMea.hasEligibilityMinimumOrder)
    //   promoMea.eligibilityMinimumDetails = promo.eligibility_minimum_details;

    // promoMea.hasEligibilityCaRange = promo.has_eligibility_ca_range;
    // if (promoMea.hasEligibilityCaRange)
    //   promoMea.eligibilityCaRangeDetails = promo.eligibility_ca_range_details;

    // promoMea.hasEligibilityOther = promo.has_eligibility_other;
    // if (promoMea.hasEligibilityOther)
    //   promoMea.eligibilityOtherDetails = promo.eligibility_other_details;

    // promoMea.emplacementPlvLabo = promo.emplacement_plv_labo;

    // promoMea.hasRemunerationUnitProduct = promo.has_remuneration_unit_product;
    // if (promo.has_remuneration_unit_product)
    //   promoMea.remunerationUnitProductDetails =
    //     promo.remuneration_unit_product_details;

    // promoMea.hasRemunerationFixed = promo.has_remuneration_fixed;
    // if (promoMea.hasRemunerationFixed)
    //   promoMea.remunerationFixedDetails = promo.remuneration_fixed_details;

    // promoMea.hasRemunerationCaAnnual = promo.has_remuneration_ca_annual;
    // if (promoMea.hasRemunerationCaAnnual)
    //   promoMea.remunerationCaAnnualDetails =
    //     promo.remuneration_ca_annual_details;
    // promoMea.hasRemunerationOther = promo.has_remuneration_other;
    // if (promoMea.hasRemunerationOther)
    //   promoMea.remunerationOtherDetails = promo.remuneration_other_details;
    // const promoMea: PromoMea = { promoId, ...promo };
    try {
      if (
        promo.promo_mea_emplacements &&
        Array.isArray(promo.promo_mea_emplacements)
      ) {
        const emplacementList = promo.promo_mea_emplacements.map(
          (item: PromoMeaEmplacementDto): PromoMeaEmplacement => ({
            promoId,
            ...convertToCamelCase(item),
          }),
        );
        // await this.promoMeaEmplacementRepository.save(emplacementList);
      }
      delete promo.promo_mea_emplacements;
      return await this.promoMeaRepository.save({
        promoId,
        ...convertToCamelCase(promo),
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async saveOpAchat(promoId: number, body: PromoAchatDto): Promise<PromoAchat> {
    const promoAchat = new PromoAchat();
    promoAchat.promoId = promoId;
    promoAchat.achatAdvantageDiscountTypeId =
      body.achat_advantage_discount_type_id;
    promoAchat.eligibilityFranco = body.eligibility_franco;
    promoAchat.eligibilityOther = body.eligibility_other;
    promoAchat.eligibilityVolume = body.eligibility_volume;
    promoAchat.eligibilityCaDetails = body.eligibility_ca_details;
    promoAchat.eligibilityAdditionalInformation =
      body.eligibility_additional_information;
    promoAchat.achatAdvantageDiscountDetails =
      body.achat_advantage_discount_details;

    return await this.promoAchatRepository.save(promoAchat);
  }
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
        return this.promoOperationTypeRepository
          .save(promoTypes)
          .catch(e => {
            throw new InternalServerErrorException(e);
          })
          .then(data => ({
            promoId,
            promoOperationTypeId: data.map(item => item.operationTypeId),
          }));
      })
      .catch(e => {
        throw new InternalServerErrorException(e);
      });
  }
  async getPromoType(promoId: number) {
    try {
      const promo = await this.promoRepository.findOne(promoId);
      const promoType = await this.promoOperationTypeRepository.find({
        where: { promoId },
      });
      return await this.promoRepository.findOne(promoId, {
        relations: ['promoType'],
      });

      return { ...promo, promoType };
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
