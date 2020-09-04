import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoOperationType } from '../entities/PromoType';
// import { PromoType } from 'src/entities/PromoType';
import {
  Repository,
  LessThan,
  MoreThan,
  Between,
  getConnection,
} from 'typeorm';
// Entity
import { Promo } from './../entities/Promo';
import { PromoGeneralPromoDto } from './dto/promo-general.dto';
import { PromoCluster } from '../entities/PromoCluster';
import { PromoAchat } from '../entities/PromoAchat';
import { PromoAchatDto } from './dto/promo.achat.dto';
import { PromoMea } from '../entities/PromoMea';
import { PromoMeaDto, PromoMeaEmplacementDto } from './dto/promo-mea.dto';
import { PromoMeaEmplacement } from '../entities/PromoMeaEmplacement';
import {
  convertToCamelCase,
  arrayEquals,
  isNotEmptyArray,
} from '../common/utils/helpers';
import { Gamme } from '../entities/Gamme';
import { Product } from '../entities/Product';
import { StorePromoMea } from '../entities/StorePromoMea';
import { PromoConso } from '../entities/PromoConso';
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
    @InjectRepository(PromoConso)
    private promoConsoRepository: Repository<PromoConso>,
    @InjectRepository(PromoMea)
    private promoMeaRepository: Repository<PromoMea>,
    @InjectRepository(PromoMeaEmplacement)
    private promoMeaEmplacementRepository: Repository<PromoMeaEmplacement>,

    @InjectRepository(StorePromoMea)
    private storePromoMeaRepository: Repository<StorePromoMea>,
  ) {}
  async validPromoType(type: string, promoId: number) {
    const isValidType = await this.promoOperationTypeRepository
      .createQueryBuilder('promoType')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .where('promoType.promoId =:promoId', { promoId })
      .andWhere('operationType.name like :name', { name: `%${type}%` })
      .getCount();
    if (!isValidType)
      throw new BadRequestException(
        `This promo is not support ${type} type, update your promo type then retry`,
      );
    return true;
  }
  async saveMeaPromo(promoId: number, promo: PromoMeaDto): Promise<any> {
    try {
      await this.validPromoType('MEA', promoId);
      if (isNotEmptyArray(promo.promo_mea_emplacements)) {
        if (
          promo.remuneration_fixed_details.has_emplacement &&
          !arrayEquals(
            promo.remuneration_fixed_details.data_emplacement.map(
              item => item.emplacement_type_id,
            ),
            promo.promo_mea_emplacements.map(item => item.emplacement_type_id),
          )
        ) {
          throw new BadRequestException(
            `Remuneration emplacement should be the same emplacement you select in the Emplacement details in the previous step`,
          );
        }
        const emplacementList = promo.promo_mea_emplacements.map(
          (item: PromoMeaEmplacementDto): PromoMeaEmplacement => ({
            promoId,
            ...convertToCamelCase(item),
          }),
        );
        await this.promoMeaEmplacementRepository.save(emplacementList);
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
    try {
      await this.validPromoType('OP ACHAT', promoId);
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
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async createPromoType(typeIds: number[]) {
    let promoId: number;
    return this.promoRepository
      .save({ gammeId: null, statusId: 0 })
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
      return await this.promoRepository.findOne(promoId, {
        relations: [
          'promoType',
          // 'remunerations',
          // 'promoClusters',
          // 'promoAchat',
          // 'promoConso',
          // 'promoMea',
        ],
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async updatePromo(promoId: number, status: number) {
    return await this.promoRepository.update(promoId, { statusId: status });
  }
  async duplicatePromo(promoId: number) {
    try {
      const promo = await this.promoRepository.findOne(promoId, {
        relations: [
          'promoType',
          'remunerations',
          'promoClusters',
          'promoAchat',
          'promoConso',
          'promoMea',
          'emplacements',
          'storePromoMeas',
        ],
        loadEagerRelations: false,
      });
      delete promo.id;
      delete promo.createdAt;
      delete promo.updatedAt;

      const promoAchat: PromoAchat = promo.promoAchat;
      delete promo.promoAchat;

      const promoConso: PromoConso = promo.promoConso;
      delete promo.promoConso;

      const promoMea: PromoMea = promo.promoMea;
      delete promo.promoMea;
      const promoMeaEmplacements: PromoMeaEmplacement[] = promoMea
        ? promoMea.promoMeaEmplacements
        : undefined;
      if (promoMea) delete promoMea.promoMeaEmplacements;
      const promoType: PromoOperationType[] = promo.promoType;
      delete promo.promoType;

      const promoClusters: PromoCluster[] = promo.promoClusters;
      delete promo.promoClusters;
      const storePromoMeas: StorePromoMea[] = promo.storePromoMeas;
      delete promo.storePromoMeas;

      const duplicatedPromo = await this.promoRepository.save(promo);
      if (promoAchat)
        await this.promoAchatRepository.save({
          ...promoAchat,
          promoId: duplicatedPromo.id,
        });
      if (promoMea)
        await this.promoMeaRepository.save({
          ...promoMea,
          promoId: duplicatedPromo.id,
        });
      if (isNotEmptyArray(promoMeaEmplacements)) {
        promoMeaEmplacements.forEach(
          item => (item.promoId = duplicatedPromo.id),
        );
        await this.promoMeaEmplacementRepository.save(promoMeaEmplacements);
      }
      if (promoConso)
        await this.promoConsoRepository.save({
          ...promoConso,
          promoId: duplicatedPromo.id,
        });
      if (isNotEmptyArray(promoType))
        await this.promoOperationTypeRepository.save(
          promoType.map(
            (item): PromoOperationType => {
              item.promoId = duplicatedPromo.id;
              return item;
            },
          ),
        );

      if (isNotEmptyArray(promoClusters))
        await this.promoClusterRepository.save(
          promoClusters.map(
            (item): PromoCluster => {
              delete item.id;
              item.promoId = duplicatedPromo.id;
              return item;
            },
          ),
        );
      if (isNotEmptyArray(promoClusters))
        await this.storePromoMeaRepository.save(
          storePromoMeas.map(item => ({
            promoId: duplicatedPromo.id,
            storeId: item.storeId,
          })),
        );

      return duplicatedPromo;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
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
    body: PromoGeneralPromoDto,
  ): Promise<Promo> {
    try {
      const promo = new Promo();
      promo.id = promoId;
      promo.gammeId =
        body.gamme.id ||
        (await await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Gamme)
          .values({ name: body.gamme.name })
          .execute()
          .then(data => data.raw.insertId));
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
      if (body.promo_concerned_id === 1) {
        if (body.option_product === 'some')
          promo.productsIdIn = body.products_in;
        if (body.option_product === 'exclude')
          promo.productsIdOut = body.products_out;
      } else if (body.promo_concerned_id === 2) {
        const product = {
          measureValue: body.value_unit_capacity,
          isLot: body.lot,
          quantityLot: body.qnt_product_lot,
        };
        let productId = body.product.id || 0;
        if (!productId)
          productId = await await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values({
              name: body.product.name,
              ean: body.product.ean,
              gammeId: promo.gammeId,
              ...product,
            })
            .execute()
            .then(data => data.raw.insertId);
        else {
          await await getConnection()
            .createQueryBuilder()
            .update(Product)
            .set({
              name: body.product.name,
              ean: body.product.ean,
              gammeId: promo.gammeId,
              ...product,
            })
            .where('id =:id', { id: productId })
            .execute();
        }
        promo.productsIdIn = [productId];
      }
      await this.promoClusterRepository.save(promoClusters);
      return await this.promoRepository.save(promo);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async delete(id: number) {
    try {
      // promoMea
      // promoConso
      // promoAchat
      // promoClusters
      // promoType
      return await this.promoRepository.delete(id);
    } catch (err) {
      return err;
    }
  }
}
