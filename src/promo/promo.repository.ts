import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';

import { Repository, EntityRepository } from 'typeorm';

import { Promo } from '../entities/Promo';

@EntityRepository(Promo)
export class PromoRepository extends Repository<Promo> {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
  ) {
    super();
  }
  async findAll(filter, promoId?: number): Promise<any> {
    const sqlQuery = this.createQueryBuilder('p')
      .leftJoinAndSelect('p.promoClusters', 'promoCluster')
      .leftJoinAndSelect('promoCluster.cluster', 'c')
      .leftJoinAndSelect('p.gamme', 'gamme')
      .leftJoinAndSelect('gamme.brand', 'brand')
      .leftJoinAndSelect('brand.laboratory', 'laboratory')
      .leftJoinAndSelect('p.promoType', 'promoType')
      .leftJoinAndSelect('p.promoConcernType', 'promoConcernType')
      .leftJoinAndSelect('p.productConcernType', 'productConcernType')
      .leftJoinAndSelect('p.status', 'status')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .leftJoinAndSelect('p.promoAchat', 'promoAchat')
      .leftJoinAndSelect('p.promoMea', 'promoMea')
      .leftJoinAndSelect('p.promoConso', 'promoConso')
      .leftJoinAndSelect('promoConso.microType', 'microType')
      .leftJoinAndSelect('microType.macroType', 'macroType')
      .leftJoinAndSelect('promoConso.circuitType', 'circuitType')
      .leftJoinAndSelect('promoConso.remunerationBase', 'remunerationBase')
      .leftJoinAndMapMany(
        'p.promoProducts',
        'product',
        'product',
        "(JSON_CONTAINS(p.product_ids,CONVERT(product.id,CHAR),'$'))",
      )
      .leftJoinAndSelect(
        'promoMea.promoMeaEmplacements',
        'promoMeaEmplacements',
      )
      .leftJoinAndSelect(
        'promoMea.documentProvideTypes',
        'documentProvideTypes',
      )
      .leftJoinAndMapOne(
        'promoMea.remunerationUnitProductEligibilityCaRange',
        'remuneration_base_type',
        'eligibility_ca_range_type',
        "(JSON_EXTRACT(promoMea.remuneration_unit_product_details,'$.eligibility_ca_range_type_id')) = eligibility_ca_range_type.id",
      )
      .leftJoinAndMapOne(
        'promoMea.remunerationCaAnnualTarget',
        'remuneration_ca_annual_target_type',
        'remuneration_ca_annual_target_type',
        "(JSON_EXTRACT(promoMea.remuneration_ca_annual_details,'$.remuneration_ca_annual_target_type_id')) = remuneration_ca_annual_target_type.id",
      )
      .leftJoinAndMapOne(
        'promoMea.remunerationCaAnnualPlate',
        'remuneration_ca_annual_plate_type',
        'remuneration_ca_annual_plate_type',
        "(JSON_EXTRACT(promoMea.remuneration_ca_annual_details,'$.remuneration_ca_annual_plate_type_id')) = remuneration_ca_annual_plate_type.id",
      )
      .leftJoinAndMapOne(
        'promoAchat.eligibilityFrancoDetails',
        'eligibility_franco_type',
        'eligibility_franco_type',
        "(JSON_EXTRACT(promoAchat.eligibility_franco,'$.eligibility_franco_type_id')) = eligibility_franco_type.id",
      )
      .leftJoinAndMapOne(
        'promoAchat.achatAdvantageDiscountData',
        'achat_advantage_discount_type',
        'achat_advantage_discount_type',
        "(JSON_EXTRACT(promoAchat.achat_advantage_discount_details,'$.achat_advantage_discount_type_id')) = achat_advantage_discount_type.id",
      )
      .leftJoinAndMapMany(
        'promoAchat.achatAdvantageSubDiscountData',
        'achat_sub_advantage_discount_type',
        'achat_sub_advantage_discount_type',
        ` JSON_CONTAINS(JSON_EXTRACT(promoAchat.achat_advantage_discount_details,"$[*].achat_advantage_sub_discount_type_id"),CONVERT(achat_sub_advantage_discount_type.id,CHAR),"$") OR
        JSON_CONTAINS(JSON_EXTRACT(promoAchat.achat_advantage_discount_details,"$.achat_advantage_sub_discount_type_id"),CONVERT(achat_sub_advantage_discount_type.id,CHAR),"$")
      `,
      ) // TODO  fix saving the achat_discount
      .leftJoinAndMapMany(
        'promoMea.eligibilityCaRangeEqualCondition',
        'equal_condition_type',
        'eligibility_equal_condition_type',
        ' JSON_CONTAINS(JSON_EXTRACT(promoMea.eligibility_ca_range_details,"$[*].equal_condition_type_id"),CONVERT(eligibility_equal_condition_type.id,CHAR),"$")',
      )
      .leftJoinAndMapMany(
        'promoMea.remunerationFixedEqualCondition',
        'equal_condition_type',
        'remuneration_fixed_equal_condition_type',
        ' JSON_CONTAINS(JSON_EXTRACT(promoMea.remuneration_fixed_details,"$.data_quantity[*].equal_condition_type_id"),CONVERT(remuneration_fixed_equal_condition_type.id,CHAR),"$")',
      )
      .leftJoinAndSelect(
        'promoMeaEmplacements.emplacementType',
        'emplacementType',
      );
    try {
      if (filter.idList)
        sqlQuery.where('p.id IN (:idList)', {
          idList: filter.idList,
        });
      if (promoId)
        return await sqlQuery.where('p.id =:promoId', { promoId }).getOne();
      if (filter.startDate && filter.endDate)
        sqlQuery.where(
          `(start_date BETWEEN :startDate AND :endDate
               OR (end_date BETWEEN :startDate AND :endDate)
               OR (start_date <= :startDate and end_date>= :endDate) )`,
          {
            startDate: filter.startDate,
            endDate: filter.endDate,
          },
        );
      if (filter.laboratoryId)
        sqlQuery.andWhere('p.laboratory_id=:laboratoryId', {
          laboratoryId: filter.laboratoryId,
        });
      if (filter.gammeId)
        sqlQuery.andWhere('p.gamme_id=:gammeId', {
          gammeId: filter.gammeId,
        });
      if (filter.clusterId && Array.isArray(filter.clusterId))
        sqlQuery.andWhere('promoCluster.cluster_id IN (:clusterId)', {
          clusterId: filter.clusterId,
        });
      else if (filter.clusterId)
        sqlQuery.andWhere('promoCluster.cluster_id=:clusterId', {
          clusterId: filter.clusterId,
        });
      if (filter.promoConcernTypeId)
        sqlQuery.andWhere('promo_concern_type_id=:promoConcernTypeId', {
          promoConcernTypeId: filter.promoConcernTypeId,
        });
      if (filter.promoTypeId)
        sqlQuery.andWhere('promoType.operation_type_id=:promoTypeId', {
          promoTypeId: filter.promoTypeId,
        });
      if (filter.type_off)
        sqlQuery.andWhere('operationType.name like :promoTypeName', {
          promoTypeName: `${filter.type_off}`,
        });

      if (filter.status)
        sqlQuery.andWhere(
          'p.status_id=:status or status.name like :statusName',
          {
            status: filter.status,
            statusName: `%${filter.status}%`,
          },
        );
      if (filter.include_av_cli)
        // TODO to update, separate it to
        sqlQuery.andWhere(
          'promoMea.has_promo_achat_linked=:isInclude and promoMea.has_promo_conso_linked=:isInclude',
          { isInclude: filter.include_av_cli },
        );
      if (filter.perPage && filter.page) {
        sqlQuery.skip(filter.perPage * (filter.page - 1)).take(filter.perPage);
      }
      return await sqlQuery.getMany();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
