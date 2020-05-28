/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { StorePromoMeaRepository } from './store-promo-mea.repository';
import { getConnection, getRepository, AdvancedConsoleLogger } from 'typeorm';
import { StorePromoMea } from '../entities/StorePromoMea';
import { ListMeaDto } from './dto/list-mea.dto';
import { User } from '../entities/User';
import { Laboratory } from '../entities/Laboratory';
import * as XLSX from 'xlsx';
import { ListMeaToExportDto } from './dto/list-mea-for-export.dto';
import { ImportedExcelPromosJSon } from './dto/imported-excel.dto';
import { validate, ValidationError, validateOrReject } from 'class-validator';
import moment = require('moment');
import { RejectionReason } from 'src/entities/RejectionReason';
import { RejectionReasonRepository } from 'src/rejection-reason/rejection-reason.repository';

@Injectable()
export class StorePromoMeaService {
  constructor(
    private storePromoMeaRepository: StorePromoMeaRepository,
    private rejectionReasonRepository: RejectionReasonRepository,
  ) {}
  private logger = new Logger('Promos Logger');

  async findPromos(
    filter?: ListMeaDto,
    user?: User,
    toImportExcel = false,
  ): Promise<any> {
    const {
      start_date,
      end_date,
      state,
      clusters,
      active,
      lab,
      circuit_vers,
      perPage,
      page,
      store_id,
    } = filter;
    const sqlQueryForSelect = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      .leftJoinAndSelect('sp.promo', 'promo', 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store', 'store.id = sp.store_id')
      .leftJoinAndSelect('promo.gamme', 'gamme')
      .leftJoinAndSelect('promo.promoType', 'promoType')
      .leftJoinAndSelect('promoType.operationType', 'operationType')
      .leftJoinAndSelect('store.clusters', 'clusters')
      .leftJoinAndSelect('sp.rejectedReason', 'rejectedReason');
    const sqlQuery = /* toImportExcel ? sqlQueryToImportExcel :*/ sqlQueryForSelect;
    if (user && user.userRoleId === 1)
      sqlQuery.leftJoinAndSelect(
        'store.owner',
        'owner',
        'owner.store_id=store.id',
      );
    sqlQuery.where(
      `(promo.start_date BETWEEN :start_date AND :end_date
      OR (promo.end_date BETWEEN :start_date AND :end_date)
      OR (promo.start_date <= :start_date and promo.end_date>= :end_date) )`,
      {
        start_date,
        end_date,
      },
    );
    if (state) {
      if (state === 'UNJUSTIFIED')
        sqlQuery.andWhere('sp.state IN(:...states)', {
          states: ['REJECTED', 'TO_JUSTIFY'],
        });
      else if (state === 'REJECTED')
        sqlQuery.andWhere('sp.state IN(:...states)', {
          states: ['REJECTED', 'OPERATION_REFUSED'],
        });
      else {
        sqlQuery.andWhere('sp.state = :state', { state });
      }
    }
    if (clusters) {
      sqlQuery.andWhere('store.clusterId = :clusters', { clusters }); //todo make it by promoCluster table
    }
    if (active === true || active === false) {
      console.log('active', active);
      sqlQuery.andWhere('sp.active = :active', { active });
    }
    if (store_id) {
      sqlQuery.andWhere('sp.storeId = :store_id', { store_id });
    }

    if (perPage && page) {
      sqlQuery.skip(filter.perPage * (page - 1)).take(perPage);
    }
    const promos = await sqlQuery.getMany();
    if (!promos.length)
      throw new NotFoundException('there is no promos with this filters');
    return promos;
  }
  async findPromo(promoId: number, storeId: number, user?: User) {
    const sqlQuery = this.storePromoMeaRepository
      .createQueryBuilder('sp')
      .leftJoinAndSelect('sp.promo', 'promo', 'promo.id = sp.promo_id')
      .leftJoinAndSelect('sp.store', 'store', 'store.id = sp.store_id');
    if (user && user.userRoleId === 1)
      sqlQuery.leftJoinAndSelect(
        'store.owner',
        'owner',
        'owner.store_id=store.id',
      );
    sqlQuery.where({ promoId, storeId });
    const promo = await sqlQuery.getOne();
    if (!promo)
      throw new NotFoundException('there is no promos with this filters');
    return promo;
  }
  async updateState(
    promoId: number | null,
    storeId: number | null,
    state: string,
    reasonId: number | null,
    updateByState = false,
  ) {
    const toSetObject: any = { state };
    const queryCondition: any = new StorePromoMea();
    if (promoId) queryCondition.promoId = promoId;
    if (storeId) queryCondition.storeId = storeId;
    if (state === 'REJECTED' && !reasonId) {
      // throw new BadRequestException('Rejected promo must has a reason');
    }
    if (state === 'REJECTED') toSetObject.rejectedReasonId = reasonId;
    if (updateByState) {
      if (state === 'TO_JUSTIFY') queryCondition.state = 'NOT_JUSTIFIED';
      if (state === 'REJECTED') {
        queryCondition.state = 'OPERATION_REFUSED';
        queryCondition.rejection_time = 2;
      }
      if (state === 'NOT_JUSTIFIED') queryCondition.state = 'TO_JUSTIFY';
      if (state === 'OPERATION_REFUSED') queryCondition.state = 'REJECTED';
    }
    try {
      this.logger.debug(
        `we are updating promoMEA to ${JSON.stringify(
          toSetObject,
        )} where ${JSON.stringify(queryCondition)}`,
      );
      if (toSetObject.state === 'REJECTED')
        return this.storePromoMeaRepository.rejectPromo(
          queryCondition,
          toSetObject,
        );
      const updateResult = await this.storePromoMeaRepository
        .update(queryCondition, toSetObject)
        .then(data => {
          if (!data.raw.affectedRows)
            throw new InternalServerErrorException('nothing to update');
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
    state:
      | 'TO_JUSTIFY'
      | 'PENDING'
      | 'CONFIRMED'
      | 'REJECTED'
      | 'NOT_JUSTIFIED'
      | 'OPERATION_REFUSED',
  ) {
    //  await this.updateState(promoId, storeId, state, reasonId);
    const promo: StorePromoMea = await this.doesPromoExist(promoId, storeId);
    promo.state = state;
    promo.rejectedReasonId = reasonId;
    if (promo.state === 'REJECTED' && promo.rejectionNumber >= 1)
      promo.rejectionNumber = promo.rejectionNumber - 1;
    if (promo.state === 'REJECTED' && promo.rejectionNumber < 1)
      promo.state = 'OPERATION_REFUSED';
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
  async toggleActive(promoId: number, storeId: number, active: boolean) {
    await getConnection()
      .createQueryBuilder()
      .update(StorePromoMea)
      .set({ active: !active })
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
    try {
      const promo = await this.storePromoMeaRepository.findOne({
        where: { promoId, storeId },
      });
      if (!promo) throw new Error();
      return promo;
    } catch (e) {
      throw new NotFoundException(
        `promo promoId:${promoId} storeId:${storeId} not found`,
      );
    }
  }
  async validatePromoState(
    promoId: number,
    storeId: number,
  ): Promise<StorePromoMea> {
    const promo: StorePromoMea = await this.doesPromoExist(promoId, storeId);
    if (
      promo.state === 'OPERATION_REFUSED' ||
      promo.state === 'NOT_JUSTIFIED'
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

    const promos = await this.findPromos(filter, user).then(promosMea =>
      promosMea.map(promoMea => this.promoToExportExcel(promoMea)),
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
        if (promo.state === 'REJECTED' && parseInt(promo.rejectionReason)) {
          this.logger.verbose('fetching the reason id');
          promo.rejectedReasonId = parseInt(promo.rejectionReason);
        } else if (promo.state === 'REJECTED') {
          this.logger.verbose('fetching the reason id');
          await this.rejectionReasonRepository
            .getReasonId(promo.rejectionReason)
            .then(data => {
              promo.rejectedReasonId = data.id;
            });
        }
        if (promo.state)
          await this.updateState(
            promo.promoId,
            promo.storeId,
            promo.state,
            promo.rejectedReasonId,
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
    const gamme: string = promoMea.promo.gamme ? promoMea.promo.gamme.name : '';
    const promoType: string = promoMea.promo.promoType
      ? promoMea.promo.promoType.operationType.name
      : '';
    const storeId: number = promoMea.storeId;
    const officineName: string =
      promoMea.store.owner.firstName + ' ' + promoMea.store.owner.lastName;
    const cluster: string = promoMea.store.clusters
      ? promoMea.store.clusters.name
      : '';
    const urlPicture: string =
      process.env.AWS_S3_BASE_URL + promoMea.urlPicture;
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
    if (promoMea.state === 'REJECTED') return 'N';
    if (promoMea.state === 'CONFIRMED') return 'O';
    return '';
  }
  evalStateValue(value: 'N' | 'O'): 'CONFIRMED' | 'REJECTED' | undefined {
    if (value === 'O') return 'CONFIRMED';
    if (value === 'N') return 'REJECTED';
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
  fixUrl(promo: any): any {
    if (promo.url_picture)
      promo.url_picture = process.env.AWS_S3_BASE_URL + promo.url_picture;
    if (promo.url_sells_listing)
      promo.url_sells_listing =
        process.env.AWS_S3_BASE_URL + promo.url_sells_listing;
    return promo;
  }
  async listLabs() {
    const laboRepository = getRepository(Laboratory);
    const labs = await laboRepository.find();
    if (!labs.length) throw new NotFoundException('labs list not found');
    return labs;
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
