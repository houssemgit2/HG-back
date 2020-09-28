/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { StorePromoMeaRepository } from './store-promo-mea.repository';
import { getConnection, getRepository } from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';
import { ListMeaDto } from './dto/list-mea.dto';
import { User } from '../entities/User';
import { Laboratory } from '../entities/Laboratory';
import * as XLSX from 'xlsx';
import { ListMeaToExportDto } from './dto/list-mea-for-export.dto';
import { ImportedExcelPromosJSon } from './dto/imported-excel.dto';
import { validateOrReject } from 'class-validator';
import moment = require('moment');
import { RejectionReason } from '../entities/RejectionReason';
import { RejectionReasonRepository } from 'src/rejection-reason/rejection-reason.repository';
import { Cron } from '@nestjs/schedule';
import { PROMO_STATE } from 'src/config/enum-types';
import { InjectEventEmitter } from 'nest-emitter';
import { PromoEventEmitter } from 'src/app.events';

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
        const promoStore = await this.insertPromoMea(promoId, null, null);
        // await this.storePromoMeaRepository.removeNotConcerned(
        //   promoId,
        //   promoStore.map(item => item.storeId),
        // );
        console.log(promoStore);
      } catch (e) {
        this.logger.error('Error in event emit after promo validation ');
        throw new InternalServerErrorException(e);
      }
    });
  }

  private logger = new Logger(StorePromoMeaService.name);

  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.debug('this task run every 00:00:00');
    const daysAfterEndDate = 22;
    const filterPromos = new ListMeaDto();
    filterPromos.end_date = moment()
      .subtract(daysAfterEndDate + 1, 'days')
      .format('YYYY-MM-DD');
    this.logger.debug(
      `fetching promo  where their end_date little then ${filterPromos.end_date} ${PROMO_STATE.NOT_JUSTIFIED}`,
    );
    try {
      const promos = await this.findPromos(filterPromos);
      this.logger.debug(`there is  ${promos.length}`);

      await this.updatePromoList(promos);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async updatePromoList(promos) {
    if (promos && Array.isArray(promos))
      return Promise.all(
        promos.map(promo => {
          if (this.isPromoExpired(promo.endDate)) {
            this.logger.warn(
              `the promo ${promo.promoId} are expired and his end date is ${promo.endDate}`,
            );
            return this.updatePromoByState(promo.promoId);
          }
        }),
      );
    this.logger.debug(
      `error during fetching promos with expired end dates,promos is not array`,
    );
  }
  isPromoExpired(endDate): boolean {
    const idealEndDate = moment(endDate)
      .endOf('month')
      .format('YYYY-MM-DD');
    const difference = moment().diff(moment(idealEndDate));
    const differenceByDays = moment.duration(difference).asDays();
    this.logger.verbose(differenceByDays + ' the difference ');
    if (differenceByDays >= 22) return true;
    return false;
  }
  async updatePromoByState(promoId: number) {
    try {
      await this.updateState(promoId, null, PROMO_STATE.TO_JUSTIFY, null, true);
      await this.updateState(promoId, null, PROMO_STATE.REJECTED, null, true);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  // TODO  optimize this
  async afterPromoPostponed(promoId: number) {
    try {
      await this.updateState(
        promoId,
        null,
        PROMO_STATE.NOT_JUSTIFIED,
        null,
        true,
      );
      await this.updateState(
        promoId,
        null,
        PROMO_STATE.OPERATION_REFUSED,
        null,
        true,
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async findPromos(
    filter?: ListMeaDto,
    user?: User,
    toImportExcel = false,
    promoId?: number,
    withTotalItem?: boolean,
  ): Promise<any> {
    const {
      start_date,
      end_date,
      state,
      clusters,
      active,
      // lab,
      // circuit_vers,
      perPage,
      page,
      store_id,
    } = filter;
    const selectedColumn = [
      'sp.promo_id as promoId',
      'promo.id as ID',
      'gamme.name as gamme',
      'clusters.name as cluster',
      'laboratory.name as laboratoire',
      'laboratory.name as lab',
      'state',
      'active',
      'uploaded_at',
      'promo.start_date',
      'promo.end_date',
      'store.cluster_id',
      '(SELECT name FROM rejection_reason WHERE rejection_reason.id=sp.siege_rejected_reason_id) as siege_rejected_reason',
      '(SELECT name FROM rejection_reason WHERE rejection_reason.id=sp.officine_rejected_reason_id) as officine_rejected_reason',
      'sp.store_id as id_cip',
      `CONCAT('${process.env.AWS_S3_BASE_URL}/',sp.url_picture) as url_picture`,
      `CONCAT('${process.env.AWS_S3_BASE_URL}/',sp.url_sells_listing)  as url_sells_listing`,
      'operationType.name as type_off',
    ];
    const sqlQueryForSelect = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      .select(selectedColumn)
      .leftJoinAndSelect('sp.promo', 'promo') //, 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store') //, 'store.cip = sp.store_id')
      .leftJoinAndSelect('promo.gamme', 'gamme')
      .leftJoinAndSelect('promo.laboratory', 'laboratory')
      .leftJoinAndSelect('promo.promoType', 'promoType')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .leftJoinAndSelect('store.clusters', 'clusters')
      .leftJoinAndSelect('sp.rejectedReason', 'rejectedReason');
    const sqlQueryToImportExcel = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      .leftJoinAndSelect('sp.promo', 'promo', 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store', 'store.cip = sp.store_id')
      .leftJoinAndSelect('promo.gamme', 'gamme')
      .leftJoinAndSelect('promo.promoType', 'promoType')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .leftJoinAndSelect('store.clusters', 'clusters')
      .leftJoinAndSelect('sp.rejectedReason', 'rejectedReason');
    const sqlQuery = toImportExcel ? sqlQueryToImportExcel : sqlQueryForSelect;
    // const sqlQuery = sqlQueryForSelect;
    if (user && user.userRoleId === 1)
      sqlQuery
        .leftJoinAndSelect(
          'store.users',
          'owner',
          //          'owner.store_id=store.cip && is_owner=true',
        )
        .addSelect([
          'store.name as descr',
          'CONCAT(owner.first_name," ",owner.last_name) as officine_name',
          'owner.first_name as contact_name',
          'owner.last_name as lst_name',
          'owner.email',
          'owner.phone as phone_num',
          'owner.address',
        ]); // TODO  check the front resp
    if (start_date && end_date)
      sqlQuery.where(
        `(promo.start_date BETWEEN :start_date AND :end_date
      OR (promo.end_date BETWEEN :start_date AND :end_date)
      OR (promo.start_date <= :start_date and promo.end_date>= :end_date) )`,
        {
          start_date,
          end_date,
        },
      );
    else if (end_date && !start_date)
      sqlQuery.where(`promo.end_date<= :end_date`, {
        end_date,
      });
    // if (user && user.userRoleId === 1) sqlQuery.andWhere(`owner.is_owner=1`);
    if (state) {
      if (state === PROMO_STATE.UNJUSTIFIED)
        sqlQuery.andWhere('sp.state IN(:...states)', {
          states: [PROMO_STATE.REJECTED, PROMO_STATE.TO_JUSTIFY],
        });
      else if (state === PROMO_STATE.REJECTED)
        sqlQuery.andWhere('sp.state IN(:...states)', {
          states: [PROMO_STATE.REJECTED, PROMO_STATE.OPERATION_REFUSED],
        });
      else {
        sqlQuery.andWhere('sp.state = :state', { state });
      }
    }
    if (clusters) {
      sqlQuery.andWhere('store.clusterId = :clusters', { clusters }); // TODO  make it by promoCluster table
    }
    if (active === true || active === false) {
      sqlQuery.andWhere('sp.active = :active', { active });
    }
    if (store_id) {
      sqlQuery.andWhere('sp.storeId = :store_id', { store_id });
    }
    if (perPage && page) {
      sqlQuery.skip(filter.perPage * (page - 1)).take(perPage);
    }
    try {
      // return await this.storePromoMeaRepository.find();
      if (promoId)
        return await sqlQuery
          .andWhere('sp.promo_id= :promoId', { promoId })
          .getRawOne();
      if (toImportExcel) return await sqlQuery.getMany();
      // const promos: StorePromoMea[] = await sqlQuery.getRawMany();
      const promos: StorePromoMea[] = await sqlQuery.getRawMany();
      const totalItem = await sqlQuery.getCount();
      // if (!promos.length)
      //   throw new NotFoundException('there is no promos with this filters');
      if (withTotalItem) return { data: promos, totalItem };
      return promos;
    } catch (e) {
      throw new InternalServerErrorException(e, 'error during fetch promos');
    }
  }
  async findPromo(promoId: number, storeId: number, user?: User) {
    const sqlQuery = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      .leftJoinAndSelect('sp.promo', 'promo', 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store', 'store.cip = sp.store_id');
    if (user && user.userRoleId === 1)
      sqlQuery.leftJoinAndSelect(
        'store.users',
        'owner',
        'owner.store_id=store.cip && owner.is_owner=true',
      );
    sqlQuery.where({ promoId, storeId });
    const promo = await sqlQuery.getOne();
    if (!promo)
      throw new NotFoundException('there is no promos with this filters');
    return promo;
  }
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
        queryCondition.rejection_time = 2;
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
    state: PROMO_STATE,
  ) {
    //  await this.updateState(promoId, storeId, state, reasonId);
    const promo: StorePromoMea = await this.doesPromoExist(promoId, storeId);
    promo.state = state;
    promo.siegeRejectedReasonId = reasonId;
    if (promo.state === PROMO_STATE.REJECTED && promo.rejectionNumber >= 1)
      promo.rejectionNumber = promo.rejectionNumber - 1;
    if (promo.state === PROMO_STATE.REJECTED && promo.rejectionNumber < 1)
      promo.state = PROMO_STATE.OPERATION_REFUSED;
    await this.storePromoMeaRepository.save(promo);
    return promo;
  }
  async savePictureUrl(promoId: number, storeId: number) {
    // console.log('picture is online saving url...', location);
    // const result = await getConnection()
    //   .createQueryBuilder()
    //   .update(StorePromoMea)
    //   .set({ urlPicture: location, state: 'PENDING', uploadedAt: Date.now() })
    //   .where('promo_id = :promo_id AND store_id =:storeId', {
    //     promo_id,
    //     storeId,
    //   })
    //   .execute();
    // console.log(result);
    const promo = await this.doesPromoExist(promoId, storeId);
    return promo;
  }
  async toggleActive(
    promoId: number,
    storeId: number,
    active: boolean,
    reason?: string,
  ) {
    const reasonId: number = reason
      ? await this.rejectionReasonRepository
          .getReasonId(reason)
          .then(data => data.id)
      : null;
    this.logger.debug(`reason is ${reason} and the reasonId is ${reasonId}`);
    await getConnection()
      .createQueryBuilder()
      .update(StorePromoMea)
      .set({ active: !active, officineRejectedReasonId: reasonId })
      .where('promo_id = :promoId AND store_id =:storeId', {
        promoId,
        storeId,
      })
      .execute();
    const promo = await this.doesPromoExist(promoId, storeId);
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
      promo.state === PROMO_STATE.OPERATION_REFUSED ||
      promo.state === PROMO_STATE.NOT_JUSTIFIED
    ) {
      throw new BadRequestException(
        `Can't upload proof to ${!promo || promo.state} promo`,
      );
    }
    return promo;
  }
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
    await this.generateExcelFile(promos, filePath, fileName, filter.type);
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
      for (const promo of promos) {
        await validateOrReject(promo);
      }
      for (const promo of promos) {
        if (
          promo.state === PROMO_STATE.REJECTED &&
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
    const lab = '';
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
    const urlPicture: string = promoMea.urlPicture;
    const state = this.stateMeaToExcel(promoMea);
    const rejectionReason = promoMea.rejectedReason
      ? promoMea.rejectedReason.name
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
    if (promoMea.state === PROMO_STATE.REJECTED) return 'N';
    if (promoMea.state === PROMO_STATE.CONFIRMED) return 'O';
    return '';
  }
  evalStateValue(
    value: 'N' | 'O',
  ): PROMO_STATE.CONFIRMED | PROMO_STATE.REJECTED | undefined {
    if (value === 'O') return PROMO_STATE.CONFIRMED;
    if (value === 'N') return PROMO_STATE.REJECTED;
    return undefined;
  }
  transformXLSMeaPromo(promo) {
    const promo_json = new ImportedExcelPromosJSon();
    promo_json.promoId = promo[`ID OP`]
      ? parseInt(promo[`ID OP`].split('--')[0])
      : null;
    promo_json.storeId = promo[`ID OP`]
      ? parseInt(promo[`ID OP`].split('--')[1])
      : parseInt(promo[`CIP Officine`]);
    promo_json.state = promo[`Validée(O)/Refusée(N)`]
      ? this.evalStateValue(promo[`Validée(O)/Refusée(N)`])
      : this.evalStateValue(promo['ValidÃ©e(O)/RefusÃ©e(N)']);
    promo_json.rejectionReason = promo[`Motif du refus`];
    return promo_json;
  }
  transformXLSMeaPromoList(promos) {
    return promos.map(promo => this.transformXLSMeaPromo(promo));
  }
  async generateExcelFile(
    promos,
    filePath: string,
    fileName: string,
    type: XLSX.BookType,
  ) {
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

    workBook.Sheets.rejection_reason = workSheetReasons;

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
      return await this.storePromoMeaRepository.save(promos).then(data => {
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
