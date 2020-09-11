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
import { ProductDto } from './dto/product.dto';
import { filterObjectProperty } from '../common/utils/helpers';
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
      return await this.promoAchatRepository.save({
        promoId,
        ...convertToCamelCase(body),
      });
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

  async getPromosAchat(promoId: number) {
    try {
      return await this.promoAchatRepository.findOne(promoId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async getPromosMea(promoId: number) {
    try {
      return await this.promoMeaRepository.findOne(promoId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async saveGeneralParams(
    promoId: number,
    body: PromoGeneralPromoDto,
  ): Promise<Promo> {
    try {
      const promoClusters: PromoCluster[] = body.clusters_id.map(item => {
        const promoCluster = new PromoCluster();
        promoCluster.promoId = promoId;
        promoCluster.clusterId = item;
        return promoCluster;
      });

      await this.promoClusterRepository.save(promoClusters);
      const promo = {
        id: promoId,
        ...convertToCamelCase(body),
      };
      const promoColumnsNames = Promo.getRepository().metadata.columns.map(
        item => item.propertyName,
      );
      filterObjectProperty(promo, promoColumnsNames);
      return await this.promoRepository.save(promo);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async getGeneralParams(promoId: number) {
    try {
      return await this.promoRepository.findOne(promoId, {
        relations: ['promoType', 'promoClusters'],
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async delete(id: number) {
    try {
      // promoMea
      // await this.promoMeaRepository.delete(id);
      await this.promoConsoRepository.delete(id);
      await this.promoAchatRepository.delete(id);
      await this.promoMeaEmplacementRepository.delete({ promoId: id });
      await this.promoMeaRepository.delete(id);
      // promoAchat
      await this.promoClusterRepository.delete({ promoId: id });
      // promoType
      return await this.promoRepository.delete(id);
    } catch (err) {
      return err;
    }
  }

  // @Transaction() async delete(
  //   id: number,
  //   @TransactionRepository(Promo) promoRepository: Repository<Promo>,
  //   // @TransactionRepository(PromoMea) promoMeaRepository: Repository<PromoMea>,
  //   // @TransactionRepository(PromoMea) promoConsoRepository: Repository<PromoMea>,
  //   // @TransactionRepository(PromoMea) promoAchatRepository: Repository<PromoMea>,
  //   // @TransactionRepository(PromoMea) promoTypeRepository: Repository<PromoMea>,
  //   // @TransactionRepository(PromoMea)
  //   // promoClusterRepository: Repository<PromoMea>,
  //   // @TransactionRepository(PromoMea)
  //   // promoMeaDocumentRepository: Repository<PromoMea>,
  // ) {
  //   // await promoMeaDocumentRepository.delete({ promoId: id });
  //   // await promoMeaRepository.delete(id);

  //   return await promoRepository.delete(id);
  // }
}
