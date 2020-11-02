import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/entities/User';

import { Promo } from './../entities/Promo';
import { PromoAchat } from '../entities/PromoAchat';
import { PromoCluster } from '../entities/PromoCluster';
import { PromoConso } from '../entities/PromoConso';
import { PromoMea } from '../entities/PromoMea';
import { PromoMeaDocumentProvide } from '../entities/PromoMeaDocumentProvide';
import { PromoMeaEmplacement } from '../entities/PromoMeaEmplacement';
import { PromoOperationType } from '../entities/PromoType';
import {
  convertToCamelCase,
  arrayEquals,
  isNotEmptyArray,
} from '../common/utils/helpers';
import { filterObjectProperty } from '../common/utils/helpers';

import { PromoRepository } from './promo.repository';

import { PromoGeneralPromoDto } from './dto/promo-general.dto';
import { PromoMeaEmplacementDto } from './dto/promo-mea-emplacement.dto';
import { PromoMeaDto } from './dto/promo-mea.dto';
import { PromoAchatDto } from './dto/promo.achat.dto';
// DTO
@Injectable()
export class PromoService {
  logger = new Logger('Promo Service');
  constructor(
    private promoRepository: PromoRepository,
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

    @InjectRepository(PromoMeaDocumentProvide)
    private promoMeaDocumentProvide: Repository<PromoMeaDocumentProvide>,
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
        // validate if the promo mea emplacement are the same   in Remuneration product unity fixed amount has emplacement
        const emplacementList = promo.promo_mea_emplacements.map(
          (item: PromoMeaEmplacementDto): PromoMeaEmplacement => ({
            promoId,
            ...convertToCamelCase(item),
          }),
        );
        await this.promoMeaEmplacementRepository.save(emplacementList);
      }
      if (promo.document_provide_types) {
        // const test = await this.promoMeaDocumentProvide.delete({ promoId });
        const savedDoc = await this.promoMeaDocumentProvide.save(
          promo.document_provide_types.map(item => ({
            promoId,
            documentProvideTypeId: item,
          })),
        );
        console.log(savedDoc);
      }
      delete promo.promo_mea_emplacements;
      delete promo.document_provide_types;
      // delete promo.remuneration_fixed_details;
      console.log(promo);
      const camelPromo = convertToCamelCase(promo);
      console.log(camelPromo);
      const created = await this.promoMeaRepository.save({
        promoId,
        ...camelPromo,
      });
      return created;
    } catch (e) {
      this.logger.error('error on saving mea promo details');
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
  async createPromoType(typeIds: number[], promoId?: number) {
    try {
      if (!promoId)
        await this.promoRepository.save({ gammeId: null }).then(promo => {
          promoId = promo.id;
        });
      else await this.promoOperationTypeRepository.delete({ promoId });
      const promoTypes = typeIds.map(item => ({
        operationTypeId: item,
        promoId,
      }));
      return this.promoOperationTypeRepository.save(promoTypes).then(data => ({
        promoId,
        promoOperationTypeId: data.map(item => item.operationTypeId),
      }));
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updatePromo(promoId: number, status: number) {
    try {
      return await this.promoRepository.update(promoId, { statusId: status });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getPromoById(promoId: number, loadEagerRelations: boolean) {
    try {
      this.logger.verbose(promoId);
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
        loadEagerRelations,
      });
      return promo;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async duplicatePromo(promoId: number) {
    try {
      // TODO  we need transaction here
      const promo = await this.getPromoById(promoId, false);
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
      // const storePromoMeas: StorePromoMea[] = promo.storePromoMeas;
      // delete promo.storePromoMeas;

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
              item.promoId = duplicatedPromo.id;
              return item;
            },
          ),
        );
      // if (isNotEmptyArray(promoClusters))
      //   await this.storePromoMeaRepository.save(
      //     storePromoMeas.map(item => ({
      //       promoId: duplicatedPromo.id,
      //       storeId: item.storeId,
      //     })),
      //   );

      return duplicatedPromo;
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
      // TODO  to do we need transaction here
      await this.promoClusterRepository.delete({ promoId: id });
      await this.promoMeaEmplacementRepository.delete({ promoId: id });
      await this.promoMeaDocumentProvide.delete({ promoId: id });

      await this.promoConsoRepository.delete(id);
      await this.promoAchatRepository.delete(id);
      await this.promoMeaRepository.delete(id);

      await this.promoOperationTypeRepository.delete({ promoId: id });

      return await this.promoRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getPromos(filter, user: User, promoId?: number): Promise<any> {
    try {
      if (user.userRoleId !== 1) filter.status = 1;
      return await this.promoRepository.findAll(filter, promoId);
    } catch (err) {
      this.logger.error('Error on fetching All Promos');
      throw new InternalServerErrorException(err);
    }
  }
}
