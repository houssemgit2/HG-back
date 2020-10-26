import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { getConnection } from 'typeorm';

import * as XLSX from 'xlsx';

import { validateOrReject } from 'class-validator';

import moment = require('moment');

import { RejectionReasonRepository } from 'src/rejection-reason/rejection-reason.repository';
import { PROMO_STATE } from 'src/common/enum/enum-types';

import { InjectEventEmitter } from 'nest-emitter';

import { PromoEventEmitter } from 'src/app.events';

import * as url from 'url';

import { DAYS_AFTER_END_DATE } from 'src/common/const';

import * as async from 'async';

import { Laboratory } from '../entities/Laboratory';
import { PromoMeaEmplacement } from '../entities/PromoMeaEmplacement';
import { RejectionReason } from '../entities/RejectionReason';
import { StorePromoMea } from '../entities/StorePromoMea';
import { StorePromoMeaStateType } from '../entities/StorePromoMeaStateType';
import { User } from '../entities/User';
import { PROMO_STATE_ID } from '../common/enum/enum-types';

import { StorePromoMeaRepository } from './store-promo-mea.repository';

import { ImportedExcelPromosJSon } from './dto/imported-excel.dto';
import { ListMeaToExportDto } from './dto/list-mea-for-export.dto';
import { ListMeaDto } from './dto/list-mea.dto';

@Injectable()
export class StorePromoMeaService {
  constructor(
    private storePromoMeaRepository: StorePromoMeaRepository,
    private rejectionReasonRepository: RejectionReasonRepository,
    @InjectEventEmitter() private readonly emitter: PromoEventEmitter,
  ) {}
  onModuleInit() {
    this.emitter.on('promoCreated', async promoId => {
      console.log(`validated new promo with id ${promoId}`);
      try {
        this.logger.verbose('promoCreated emitted');
        const promoStore = await this.insertPromoMea(promoId, null, null);
        // await this.storePromoMeaRepository.removeNotConcerned(
        //   promoId,
        //   promoStore.map(item => item.storeId),
        // );
        // console.log(promoStore);
      } catch (e) {
        this.logger.error('Error in event emit after promo validation ');
        throw new InternalServerErrorException(e);
      }
    });
    // this.handleCron(); // TODO you may have to remove this
    // this.storePromoMeaRepository
    //   .findExpiredPromo(1)
    //   .then(tes => console.log(tes));
  }

  private logger = new Logger(StorePromoMeaService.name);

  @Cron('0 0 * * *')
  async handleCron() {
    // TODO fix this cron after the bug in the v1
    this.logger.debug('this task run every 00:00:00');
    const expiredEndDate = moment()
      .subtract(DAYS_AFTER_END_DATE, 'days')
      .format('YYYY-MM-DD');
    this.logger.debug(
      `fetching promo  where their end_date little then ${expiredEndDate} ${PROMO_STATE.NOT_JUSTIFIED}`,
    );
    try {
      const promos = await this.storePromoMeaRepository.findExpiredPromo(
        expiredEndDate,
      );
      if (promos.length) await this.updatePromoList(promos);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async updatePromoList(promos) {
    const errorList = [];
    if (promos && Array.isArray(promos))
      async.eachLimit(
        promos,
        100,
        (promo, callback) => {
          this.updatePromoByState(promo)
            .catch(err => {
              console.log(err);
              errorList.push({
                promoId: promo.promoId,
                err,
              });
              callback();
            })
            .then(() => {
              callback();
            });
        },
        err => {
          if (err) {
            console.log('A promo failed to process');
          } else {
            console.log('All promos have been processed successfully');
          }
        },
      );
  }
  async updatePromoByState(promo: StorePromoMea) {
    return new Promise((resolve, reject) => {
      try {
        if (promo.stateId === PROMO_STATE_ID.TO_JUSTIFY) {
          return this.storePromoMeaRepository
            .update(promo, {
              stateId: PROMO_STATE_ID.NOT_JUSTIFIED,
            })
            .then(() => {
              return resolve(true);
            });
        }
        if (promo.stateId === PROMO_STATE_ID.REJECTED) {
          return this.storePromoMeaRepository
            .update(promo, {
              stateId: PROMO_STATE_ID.OPERATION_REFUSED,
            })
            .then(() => {
              return resolve(true);
            });
        }
        // when opromo is postponed
        if (promo.stateId === PROMO_STATE_ID.NOT_JUSTIFIED) {
          return this.storePromoMeaRepository
            .update(promo, {
              stateId: PROMO_STATE_ID.TO_JUSTIFY,
            })
            .then(() => {
              return resolve(true);
            });
        }
        if (promo.stateId === PROMO_STATE_ID.OPERATION_REFUSED) {
          return this.storePromoMeaRepository
            .update(promo, {
              stateId: PROMO_STATE_ID.REJECTED,
              rejectionNumber: 1, // TODO check this
            })
            .then(() => {
              return resolve(true);
            });
        }
      } catch (e) {
        return reject(e);
      }
    });
  }
  // TODO  optimize this

  async findPromos(
    filter?: ListMeaDto,
    user?: User,
    toImportExcel = false,
    promoId?: number,
    withTotalItem?: boolean,
  ): Promise<any> {
    const sqlQueryForSelect = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      // .select(filter.v2 ? null : selectedColumnForMobile)
      .select()
      .leftJoinAndSelect('sp.promo', 'promo') //, 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store') //, 'store.cip = sp.store_id')
      .leftJoinAndSelect('promo.gamme', 'gamme')
      .leftJoinAndSelect('promo.promoMea', 'promoMea')
      .leftJoinAndSelect(
        'promoMea.repaymentCircuitType',
        'repaymentCircuitType',
      )
      .leftJoinAndSelect(
        'promoMea.promoMeaEmplacements',
        'promoMeaEmplacements',
      )
      .leftJoinAndSelect(
        'promoMeaEmplacements.emplacementType',
        'emplacementType',
      )
      .leftJoinAndSelect('sp.stateType', 'stateType')
      .leftJoinAndSelect('promo.laboratory', 'laboratory')
      .leftJoinAndSelect('promo.promoConcernType', 'promoConcernType')
      .leftJoinAndSelect('promo.promoType', 'promoType')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .leftJoinAndSelect('store.clusters', 'clusters')
      .leftJoinAndMapMany(
        'p.promoProducts',
        'product',
        'product',
        "(JSON_CONTAINS(promo.product_ids,CONVERT(product.id,CHAR),'$'))",
      )
      .leftJoinAndSelect(
        'sp.officineRejectedReason',
        'officineRejectedReason',
        'sp.officineRejectedReasonId=officineRejectedReason.id',
      )
      .leftJoinAndSelect(
        'sp.siegeRejectedReason',
        'siegeRejectedReason',
        'sp.siegeRejectedReasonId=siegeRejectedReason.id',
      );
    const sqlQueryToImportExcel = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      .leftJoinAndSelect('sp.promo', 'promo', 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store', 'store.cip = sp.store_id')
      .leftJoinAndSelect('promo.gamme', 'gamme')
      .leftJoinAndSelect('sp.stateType', 'stateType')
      .leftJoinAndSelect('promo.laboratory', 'laboratory')
      .leftJoinAndSelect('promo.promoType', 'promoType')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .leftJoinAndSelect('store.clusters', 'clusters')
      .leftJoinAndSelect('sp.siegeRejectedReason', 'siegeRejectedReason');
    const sqlQuery = toImportExcel ? sqlQueryToImportExcel : sqlQueryForSelect;
    // const sqlQuery = sqlQueryForSelect;
    if (user && user.userRoleId === 1 && toImportExcel)
      sqlQuery
        .leftJoinAndSelect('store.users', 'owner')
        .addSelect([
          'store.name as descr',
          'CONCAT(owner.first_name," ",owner.last_name) as officine_name',
          'owner.first_name as contact_name',
          'owner.last_name as lst_name',
          'owner.email',
          'owner.phone as phone_num',
          'owner.address',
        ]);
    // TODO  check the front resp
    else if (user && user.userRoleId === 1)
      sqlQuery.leftJoinAndSelect(
        'store.owner',
        'owner',
        //          'owner.store_id=store.cip && is_owner=true',
      );

    if (filter.start_date && filter.end_date)
      sqlQuery.where(
        `(promo.start_date BETWEEN :startDate AND :endDate
      OR (promo.end_date BETWEEN :startDate AND :endDate)
      OR (promo.start_date <= :startDate and promo.end_date>= :endDate) )`,
        {
          startDate: filter.start_date,
          endDate: filter.end_date,
        },
      );
    else if (filter.end_date && !filter.start_date)
      sqlQuery.where(`promo.end_date<= :endDate`, {
        endDate: filter.end_date,
      });
    // if (user && user.userRoleId === 1) sqlQuery.andWhere(`owner.is_owner=1`);
    console.log(filter);
    if (filter.state) {
      if (filter.state === PROMO_STATE.UNJUSTIFIED)
        sqlQuery.andWhere('stateType.name IN(:...states)', {
          states: [PROMO_STATE.REJECTED, PROMO_STATE.TO_JUSTIFY],
        });
      else if (filter.state === PROMO_STATE.REJECTED)
        sqlQuery.andWhere('stateType.name IN(:...states)', {
          states: [PROMO_STATE.REJECTED, PROMO_STATE.OPERATION_REFUSED],
        });
      else {
        sqlQuery.andWhere('stateType.name = :state', { state: filter.state });
      }
    }
    if (filter.clusters) {
      sqlQuery.andWhere('clusters.name = :clusters', {
        clusters: filter.clusters,
      }); // TODO  make it by promoCluster table
    }
    if (filter.lab) {
      sqlQuery.andWhere('clusters.name = :clusters', {
        clusters: filter.clusters,
      }); // TODO  make it by promoCluster table
    }

    if (typeof filter.active === 'string')
      filter.active = JSON.parse(filter.active); // TODO se termine dans
    if (filter.active === true || filter.active === false) {
      // TODO fix this filter: always come as true even if user send false
      sqlQuery.andWhere('sp.active = :active', { active: filter.active });
    }
    if (filter.store_id) {
      sqlQuery.andWhere('sp.storeId = :storeId', { storeId: filter.store_id });
    }
    if (filter.circuit_vers) {
      sqlQuery.andWhere(
        'repaymentCircuitType.name = :repaymentCircuit or repaymentCircuitType.id = :repaymentCircuitId',
        {
          repaymentCircuit: filter.circuit_vers,
          repaymentCircuitId: filter.circuit_vers_id,
        },
      );
    }
    if (filter.perPage && filter.page) {
      sqlQuery.skip(filter.perPage * (filter.page - 1)).take(filter.perPage);
    }
    try {
      // return await this.storePromoMeaRepository.find();
      if (promoId)
        return await sqlQuery
          .andWhere('sp.promo_id= :promoId', { promoId })
          .getOne();
      if (toImportExcel) {
        const promo = await sqlQuery.getMany();
        return promo;
      }
      // const promos: StorePromoMea[] = await sqlQuery.getRawMany();
      const promos: StorePromoMea[] = await sqlQuery.getMany();

      const totalItem = await sqlQuery.getCount();
      // if (!promos.length)
      //   throw new NotFoundException('there is no promos with this filters');
      if (withTotalItem) return { data: promos, totalItem };
      return promos;
    } catch (e) {
      throw new InternalServerErrorException(e, 'error during fetch promos');
    }
  }
  // async findPromo(promoId: number, storeId: number, user?: User) {
  //   const sqlQuery = this.storePromoMeaRepository
  //     .createQueryBuilder('sp')
  //     .leftJoinAndSelect('sp.promo', 'promo', 'promo.id = sp.promo_id')
  //     .leftJoinAndSelect('sp.store', 'store', 'store.cip = sp.store_id');
  //   if (user && user.userRoleId === 1)
  //     sqlQuery.leftJoinAndSelect(
  //       'store.users',
  //       'owner',
  //       'owner.store_id=store.cip && owner.is_owner=true',
  //     );
  //   sqlQuery.where({ promoId, storeId });
  //   const promo = await sqlQuery.getOne();
  //   if (!promo)
  //     throw new NotFoundException('there is no promos with this filters');
  //   return promo;
  // }
  async updateState(
    promoId: number,
    storeId: number | null,
    state: string,
    reasonId: number | null,
    updateByState = false,
  ) {
    const toSetObject: any = { state };
    const queryCondition: any = new StorePromoMea();
    if (promoId) queryCondition.promoId = promoId;
    if (storeId) queryCondition.storeId = storeId;
    if (state === PROMO_STATE.REJECTED && !reasonId) {
      throw new BadRequestException('Rejected promo must has a reason');
    }
    if (state === PROMO_STATE.REJECTED)
      toSetObject.siegeRejectedReasonId = reasonId;
    if (updateByState) {
      if (state === PROMO_STATE.TO_JUSTIFY)
        queryCondition.state = PROMO_STATE.NOT_JUSTIFIED;
      if (state === PROMO_STATE.REJECTED) {
        queryCondition.state = PROMO_STATE.OPERATION_REFUSED;
        queryCondition['rejection_time'] = 2;
      }
      if (state === PROMO_STATE.NOT_JUSTIFIED)
        queryCondition.state = PROMO_STATE.TO_JUSTIFY;
      if (state === PROMO_STATE.OPERATION_REFUSED)
        queryCondition.state = PROMO_STATE.REJECTED;
    }
    try {
      this.logger.debug(
        `updating promoMEA to ${JSON.stringify(
          toSetObject,
        )} where ${JSON.stringify(queryCondition)}`,
      );
      if (toSetObject.state === PROMO_STATE.REJECTED)
        return this.storePromoMeaRepository.rejectPromo(
          queryCondition,
          toSetObject,
        );
      const updateResult = await this.storePromoMeaRepository
        .update(queryCondition, toSetObject)
        .then(data => {
          if (!data.raw.affectedRows)
            this.logger.error(
              `no update from ${queryCondition.state} to ${toSetObject.state} promoId=${promoId}`,
            );
          else
            this.logger.verbose(
              `${data.raw.affectedRows} update from ${queryCondition.state} to ${toSetObject.state} for promoId=${promoId}`,
            );
        });
      return updateResult;
    } catch (e) {
      throw new InternalServerErrorException(
        `failed to update promo state, ${e}`,
      );
    }
  }
  async validateProof(
    promoId: number,
    storeId: number,
    reasonId: number,
    state?: PROMO_STATE,
    stateId?: number,
  ) {
    const promo: StorePromoMea = await this.doesPromoExist(promoId, storeId);
    const toSet = new StorePromoMea();
    toSet.stateId =
      stateId ||
      (await getConnection()
        .getRepository(StorePromoMeaStateType)
        .findOne({ where: { name: state } })
        .then(data => {
          promo.stateType = data;
          return data.id;
        }));
    toSet.siegeRejectedReasonId = reasonId;
    if (toSet.stateId === PROMO_STATE_ID.REJECTED && promo.rejectionNumber >= 1)
      toSet.rejectionNumber = promo.rejectionNumber - 1;
    if (
      toSet.stateId === PROMO_STATE_ID.REJECTED &&
      (promo.rejectionNumber < 1 || toSet.rejectionNumber < 1)
    )
      toSet.stateId = PROMO_STATE_ID.OPERATION_REFUSED;
    await this.storePromoMeaRepository.update(
      { promoId: promo.promoId, storeId: promo.storeId },
      toSet,
    );
    return await this.doesPromoExist(promoId, storeId);
  }
  // async savePictureUrl(promoId: number, storeId: number) {
  //   // console.log('picture is online saving url...', location);
  //   // const result = await getConnection()
  //   //   .createQueryBuilder()
  //   //   .update(StorePromoMea)
  //   //   .set({ urlPicture: location, state: 'PENDING', uploadedAt: Date.now() })
  //   //   .where('promo_id = :promo_id AND store_id =:storeId', {
  //   //     promo_id,
  //   //     storeId,
  //   //   })
  //   //   .execute();
  //   // console.log(result);
  //   const promo = await this.doesPromoExist(promoId, storeId);
  //   return promo;
  // }
  async toggleActive(
    promoId: number,
    storeId: number,
    active: boolean,
    reason?: string,
    reasonId?: number,
  ) {
    reasonId =
      reasonId ||
      (reason
        ? await this.rejectionReasonRepository
            .getReasonId(reason)
            .then(data => data.id)
        : null);
    this.logger.debug(`reason is ${reason} and the reasonId is ${reasonId}`);
    // await getConnection()
    //   .createQueryBuilder()
    //   .update(StorePromoMea)
    //   .set({ active: !active, officineRejectedReasonId: reasonId })
    //   .where('promo_id = :promoId AND store_id =:storeId', {
    //     promoId,
    //     storeId,
    //   })
    //   .execute();
    const promo = await this.storePromoMeaRepository.save({
      promoId,
      storeId,
      active: !active,
      officineRejectedReasonId: reasonId,
    });
    // const promo = await this.doesPromoExist(promoId, storeId);
    return promo;
  }
  async doesPromoExist(
    promoId: number,
    storeId: number,
  ): Promise<StorePromoMea> {
    const promo = await this.storePromoMeaRepository
      .findOne({
        where: { promoId, storeId },
      })
      .catch(e => {
        throw new InternalServerErrorException(e);
      });
    if (!promo)
      throw new NotFoundException(
        `promo promoId:${promoId} storeId:${storeId} not found`,
      );
    return promo;
  }
  async validatePromoState(
    promoId: number,
    storeId: number,
  ): Promise<StorePromoMea> {
    const promo: StorePromoMea = await this.doesPromoExist(
      promoId,
      storeId,
    ).catch(e => {
      throw new InternalServerErrorException(e);
    });
    if (
      promo.stateType.name === PROMO_STATE.OPERATION_REFUSED ||
      promo.stateType.name === PROMO_STATE.NOT_JUSTIFIED
    ) {
      throw new BadRequestException(
        `Can't upload proof to ${!promo || promo.stateType.name} promo`,
      );
    }
    return promo;
  }
  // FUNCTION TO GENERATE EXCEL FILE WITH STORE PROMO MEA TO UPDATE STATE WITH FILE
  async exportExcelPromoState(filter: ListMeaToExportDto, user?: User) {
    // if (!filter.state) filter.state = 'PENDING';
    // if (filter.active === undefined) filter.active = true;
    if (!filter.type) filter.type = 'csv';
    const promos = await this.findPromos(filter, user, true).then(promosMea => {
      this.logger.debug(`promosMea is array ${Array.isArray(promosMea)}`);
      this.logger.debug(`promosMea length ${promosMea.length}`);
      return promosMea.map(promoMea => this.promoToExportExcel(promoMea));
    });
    if (!promos)
      throw new InternalServerErrorException(
        'no promos in the list check your date list',
      );
    const fileName = `PromosList-${moment().format(
      moment().format('YYYYMMDD'),
    )}.${filter.type}`;
    const filePath = `${__dirname}/../output/exportedExcel/${fileName}`;
    await this.generateExcelFile(promos, filePath, filter.type);
    return filePath;
  }
  async updateMeaByExcel(filePath: string) {
    try {
      this.logger.verbose('reading the file');
      const workbook: XLSX.WorkBook = XLSX.readFile(filePath);
      const names: string[] = workbook.SheetNames;
      const workSheet: XLSX.WorkSheet = workbook.Sheets[names[0]];
      const promoJson = XLSX.utils.sheet_to_json(workSheet);
      const promos = this.transformXLSMeaPromoList(promoJson);
      this.logger.verbose('a list of the promo we will update theri state');
      // console.log(promos);
      for (const promo of promos) {
        // VALIDATE BY SINGLE PROMO
        await validateOrReject(promo, {
          validationError: {
            // Indicates if target should be exposed in ValidationError.
            target: true,
            // Indicates if validated value should be exposed in ValidationError.
            value: true,
          },
        });
      }
      for (const promo of promos) {
        if (
          promo.stateId === PROMO_STATE_ID.REJECTED &&
          parseInt(promo.rejectionReason)
        ) {
          this.logger.verbose('fetching the reason id');
          promo.siegeRejectedReasonId = parseInt(promo.rejectionReason);
        } else if (promo.state === PROMO_STATE.REJECTED) {
          this.logger.verbose('fetching the reason id');
          await this.rejectionReasonRepository
            .getReasonId(promo.rejectionReason)
            .then(data => {
              promo.siegeRejectedReasonId = data.id;
            });
        }
        if (promo.state)
          await this.updateState(
            promo.promoId,
            promo.storeId,
            promo.state,
            promo.siegeRejectedReasonId,
            false,
          );
      }
      return promos;
    } catch (e) {
      const err = Array.isArray(e)
        ? e.map(item => ({
            row: `${item.target.promoID}--${item.target.storeId}`,
            constraints: item.constraints,
          }))
        : `something went wrong during update ${e}`;
      throw new BadRequestException(
        `failed file validation ${JSON.stringify(err)}`,
      );
    }
  }
  promoToExportExcel(promoMea: StorePromoMea) {
    const idSys: string = promoMea.promoId + '--' + promoMea.storeId;
    const lab = promoMea?.promo?.gamme?.brand?.laboratory?.name ?? '';
    const libelle = '';
    const gamme: string =
      promoMea.promo && promoMea.promo.gamme ? promoMea.promo.gamme.name : '';
    const promoType: any = // TODO  fix this type related to promo type
      promoMea.promo && promoMea.promo.promoType
        ? promoMea.promo.promoType
        : // TODO  fix this filter by the promo type
          '';
    const storeId: number = promoMea.storeId;
    const officineName: string =
      promoMea.store && promoMea.store.users[0]
        ? promoMea.store.users[0].firstName +
          ' ' +
          promoMea.store.users[0].lastName
        : '';
    // promoMea.store.owner.firstName + ' ' + promoMea.store.owner.lastName;
    const cluster: string =
      promoMea.store && promoMea.store.clusters
        ? promoMea.store.clusters.name
        : '';
    const urlPicture: string =
      promoMea.urlPicture && url.parse(promoMea.urlPicture).host
        ? promoMea.urlPicture
        : `${process.env.AWS_S3_BASE_URL}${promoMea.urlPicture}`;
    const state = this.stateMeaToExcel(promoMea);
    const rejectionReason = promoMea.siegeRejectedReason
      ? promoMea.siegeRejectedReason.name
      : '';
    return {
      idSys,
      lab,
      libelle,
      gamme,
      promoType,
      storeId,
      officineName,
      cluster,
      urlPicture,
      state,
      rejectionReason,
    };
  }
  stateMeaToExcel(promoMea: StorePromoMea): string {
    if (promoMea.stateId === 4) return 'N';
    if (promoMea.stateId === 3) return 'O';
    return '';
  }
  evalStateValue(
    value: 'N' | 'O',
  ): PROMO_STATE_ID.CONFIRMED | PROMO_STATE_ID.REJECTED | undefined {
    console.log(
      'value is ',
      value,
      value === 'O'
        ? PROMO_STATE.CONFIRMED
        : value === 'N'
        ? PROMO_STATE.REJECTED
        : null,
    );
    if (value === 'O') return PROMO_STATE_ID.CONFIRMED;
    if (value === 'N') return PROMO_STATE_ID.REJECTED;
    return undefined;
  }
  transformXLSMeaPromo(promo) {
    const promoJson = new ImportedExcelPromosJSon();
    promoJson.promoId = promo[`ID OP`]
      ? parseInt(promo[`ID OP`].split('--')[0])
      : null;
    promoJson.storeId = promo[`ID OP`]
      ? parseInt(promo[`ID OP`].split('--')[1])
      : parseInt(promo[`CIP Officine`]);
    promoJson.stateId = promo[`Validée(O)/Refusée(N)`]
      ? this.evalStateValue(promo[`Validée(O)/Refusée(N)`])
      : this.evalStateValue(promo['ValidÃ©e(O)/RefusÃ©e(N)']);
    promoJson.rejectionReason = promo[`Motif du refus`];

    return promoJson;
  }
  transformXLSMeaPromoList(promos) {
    return promos.map(promo => this.transformXLSMeaPromo(promo));
  }
  async generateExcelFile(promos, filePath: string, type: XLSX.BookType) {
    const workBook = XLSX.utils.book_new();
    workBook.SheetNames = ['promos', 'rejection_reason'];
    const workSheet = XLSX.utils.json_to_sheet(promos);
    // this.logger.verbose(workSheet);
    // workSheet['!rows'] = [{}];
    // workSheet.A1 = { t: 's', v: 'ID OP' };
    workSheet.A1 = { t: 's', v: 'ID OP' };
    workSheet.B1 = { t: 's', v: 'Laboratoire' };
    workSheet.C1 = { t: 's', v: 'Intitulé du Produit' };
    workSheet.D1 = { t: 's', v: 'Gamme' };
    workSheet.E1 = { t: 's', v: `Type d'Opé` };
    workSheet.F1 = { t: 's', v: 'CIP Officine' };
    workSheet.G1 = { t: 's', v: `Nom de l'Officine` };
    workSheet.H1 = { t: 's', v: 'Cluster' };
    workSheet.I1 = { t: 's', v: 'Lien Photo' };
    workSheet.J1 = { t: 's', v: 'Validée(O)/Refusée(N)' };
    workSheet.K1 = { t: 's', v: 'Motif du refus' };
    workBook.Sheets.promos = workSheet;
    let reasons: RejectionReason[];
    await this.rejectionReasonRepository.findAll().then(data => {
      reasons = data;
    });
    const workSheetReasons = XLSX.utils.json_to_sheet(reasons);

    workBook.Sheets['rejection_reason'] = workSheetReasons;

    // XLSX.utils.book_append_sheet(workBook, workSheet, fileName);
    // XLSX.utils.book_append_sheet(workBook, worksheetReasons, fileName);

    XLSX.writeFile(workBook, filePath, { bookType: type });

    return filePath;
  }

  async insertPromoMea(promoId?: number, clusterId?: number, storeId?: number) {
    // TODO remove this if never used, it fetch and insert the promo mea store
    try {
      const promos = await this.storePromoMeaRepository.findPromoMeaByIdPromoStore(
        promoId,
        clusterId,
        storeId,
      );
      console.log(promos);
      return await this.storePromoMeaRepository
        .save(promos)
        .catch(e => {
          throw new Error(e);
        })
        .then(data => {
          if (data)
            this.logger.log(
              `store promo mea inserted successfully after validated promo ${promoId}`,
            );
          return data;
        });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async getLabs() {
    // this function will be user just for old mobile app version
    return await getConnection()
      .getRepository(Laboratory)
      .find();
  }

  correspondancePromo(promo: StorePromoMea) {
    // const promoMea = nestedObjectsUtil.flatten(promo);
    const newPromo = {
      ...promo,
      ID: promo.promoId,
      idCip: promo.storeId,
      state: promo.stateType.name,
      endDate: promo.promo.endDate,
      typeOff: promo.promo.promoType
        .map(item => item.operationType.name)
        .join(' + '),
      gamme: promo.promo.gamme.name,
      libelle: '',
      // lab : promo.promo.gamme.brand.laboratory.name
      lab: promo.promo.gamme.brand.laboratory.name,
      detMis: 'det_mis',
      detRen: 'det_ren',
      zoneMis: promo.promo?.promoMea?.promoMeaEmplacements
        .map((item: PromoMeaEmplacement) => {
          return `${item.emplacementType.name} ${!item.details ||
            `(${item.details})`} \n`;
        })
        .join(','),
    };

    return newPromo;
  }
}

// repository.find({
//   count1: LessThen(5), // < operator
//   count2: MoreThen(10), // > operator
//   name: Equal("Hello"),
//   title: Not(Equal("Buy")),
//   description1: Like("%AAA%BBB%"),
//   description2: Not(Like("%ADAD_A")),
//   date1: Between("yesterday", "today"),
//   date2: Not(Between("yesterday", "today")),
//   type1: In("a", "b", "c", "d"),
//   type1: Not(In("a", "b", "c", "d")),
//   array1: Any(["a", "b", "c", "d"]),
//   type1: Not(In("a", "b", "c", "d")),
//   a1: IsNull(),
//   a2: Not(IsNull())
// });
