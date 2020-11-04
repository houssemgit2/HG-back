/* eslint-disable @typescript-eslint/camelcase */
import { PdfPromoGeneratorService } from '@app/pdf-promo-generator';
import { PdfCalendarGeneratorService } from '@app/pdf-calendar-generator';

import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
  Query,
  Body,
  Post,
  UsePipes,
  Header,
  Res,
  UploadedFile,
  UseInterceptors,
  Logger,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

import * as fs from 'fs';

import { MeaUploadService } from 'src/mea-upload/mea-upload.service';

import * as url from 'url';

import { SetStateDto } from 'src/store-promo-mea/dto/setState.dto';
import { DatesListValidationPipe } from 'src/common/pipes/dates.validation.pipe';
import { RejectionReasonValidation } from 'src/common/pipes/rejection-reason.pipe';
import { ListMeaToExportDto } from 'src/store-promo-mea/dto/list-mea-for-export.dto';

import { InjectEventEmitter } from 'nest-emitter';

import { PromoEventEmitter } from 'src/app.events';

import * as snakeCaseKeys from 'snakecase-keys';

import { StorePromoMeaGuard } from 'src/auth/guards/store-promo-mea.guard';
import { ClientGuard } from 'src/auth/guards/client.guard';
import { StoreAdminGuard } from 'src/auth/guards/store-admin.guard';
import { multerOptions, meaS3MulterOptions } from 'src/common/multer';
import { DAYS_AFTER_END_DATE } from 'src/common/const';

import { UserReq } from '../auth/get-user.decorator';
import { Promo } from '../entities/Promo';
import { StorePromoMea } from '../entities/StorePromoMea';
import { User } from '../entities/User';
import { StorePromoMeaService } from '../store-promo-mea/store-promo-mea.service';
import { StorePromoSelectedService } from './../store-promo-selected/store-promo-selected.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiFile } from '../common/decorators/api-file.decorator';
import { refreshDate, convertToSnakeCase } from '../common/utils/helpers';
import { ActiveToggleDto } from '../store-promo-mea/dto/active-toggle.dto';
import { ListMeaDto } from '../store-promo-mea/dto/list-mea.dto';
import { PromoAchatValidationPipe } from '../common/pipes/promo/promo-achat.pipe';
import { PromoValidationPipe } from '../common/pipes/promo/promo-general.Validation.pipe';
import { PromoTransformPipe } from '../common/pipes/promo/transform-promo.pipe';

import { PromoService } from './promo.service';

import { CalendarDto } from './dto/calendar.dto';
import { GeneratePdfPromosDto } from './dto/generate-pdf-promos.dto';
import { GetPromoDto } from './dto/get-promo.dto';
import { GetSelectedDto } from './dto/get-selected.dto';
import { PromoGeneralPromoDto } from './dto/promo-general.dto';
import { PromoIdDto } from './dto/promo-id.dto';
import { PromoMeaDto } from './dto/promo-mea.dto';
import { PromoAchatDto } from './dto/promo.achat.dto';
import { SavePromoTypeDto } from './dto/save-promo-types.dto';
import { SaveSelectedDto } from './dto/save-selected.dto';
import { PromoMeaEmplacementValidationPipe } from '../common/pipes/promo/promo-mea-emplacment.pipe';
const multerOptionsForMeaExcel: MulterOptions = multerOptions(
  /xlsm|xlsx|xlsb|xls|xla|xlml|ods|csv|.xlsx|csv/,
  `${__dirname}/../uploads/mea-state/`,
);
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('promos')
export class PromoController {
  constructor(
    private readonly promoService: PromoService,
    private pdfPromoGeneratorService: PdfPromoGeneratorService,
    private pdfCalendarGeneratorService: PdfCalendarGeneratorService,
    private storePromoSelectedService: StorePromoSelectedService,
    private storePromoMeaService: StorePromoMeaService,
    private meaUploadService: MeaUploadService,
    @InjectEventEmitter() private readonly emitter: PromoEventEmitter,
  ) {}
  logger = new Logger('promo controller');

  @ApiTags('Promo')
  @Post('generate/calendar/csv')
  @Header('Content-Type', 'image/xlsx')
  @Header('Content-Disposition', 'attachment; filename=promos.xlsx')
  async generateMeaCalendarCsv(
    @Body() { idList }: CalendarDto,
    @UserReq() user: User,
    @Res() response,
  ) {
    const promos = await this.promoService.getPromos({ idList }, user);
    const v1PromosKeys = this.pdfCalendarGeneratorService.promoKeysCorrespondant(
      promos,
      'MEA',
    );

    const filePath = await this.pdfCalendarGeneratorService.generateCsvCalendar(
      v1PromosKeys,
      'MEA',
      'xlsx',
    );
    return response.status(200).download(filePath);
  }

  @ApiTags('Promo')
  @Post('generate/calendar')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment; filename=promos.pdf')
  async generateMeaCalendar(
    @Body() { idList }: CalendarDto,
    @UserReq() user: User,
    @Res() response,
  ) {
    const promos = await this.promoService.getPromos({ idList }, user);
    const v1PromosKeys = this.pdfCalendarGeneratorService.promoKeysCorrespondant(
      promos,
      'MEA',
    );

    const filePath = await this.pdfCalendarGeneratorService.generate(
      v1PromosKeys,
      'MEA',
    );
    return response.status(200).download(filePath);
  }
  @ApiTags('Promo')
  @Get('generate/calendar')
  async generateCalendar(
    @Query() query: GetPromoDto,
    @UserReq() user: User,
    @Res() res: any,
  ) {
    const promos: Promo[] = await this.promoService.getPromos(query, user);
    const v1PromosKeys = this.pdfCalendarGeneratorService.promoKeysCorrespondant(
      promos,
      query.type_off,
    );
    this.logger.debug(`${promos.length} promos found * _ *`);
    if (query.toDownloadPdf === false) {
      const result = v1PromosKeys.map(item => convertToSnakeCase(item));

      return res.status(200).json({
        statusCode: 200,
        data: result.map(item => ({ ID: item.id, ...item })),
      });
    }
    // const flattenPromos = promos.map(promo => flatten(promo));
    let filePath: any;
    if (query.csv)
      filePath = await this.pdfCalendarGeneratorService.generateCsvCalendar(
        v1PromosKeys,
        query.type_off,
        'xlsx',
      );
    else
      filePath = await this.pdfCalendarGeneratorService.generate(
        v1PromosKeys,
        // promos, // .map(item => ({ ID: item.id, ...item })),
        query.type_off,
      );
    this.logger.debug(`pdf generagted at ${filePath}`);
    return res.status(200).download(filePath);
  }

  @ApiTags('Promo')
  @Post('generate/promos')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment; filename=promos.pdf')
  async generatePromos(@Body() body: GeneratePdfPromosDto, @Res() response) {
    const file: string = await this.pdfPromoGeneratorService.generatePDF(
      body.promos,
    );
    return fs.createReadStream(file).pipe(response);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'saved promo' })
  @ApiResponse({ status: 200, description: 'saved promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiTags('Promo')
  @Post('saved')
  @UseGuards(AuthGuard())
  async saveSelected(@Body() body: SaveSelectedDto, @UserReq() user: User) {
    const { month, year, promos } = body;
    return await this.storePromoSelectedService.savedPromos(
      user.storeId,
      month,
      year,
      promos,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'saved print config' })
  @ApiResponse({ status: 200, description: 'saved print config' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiTags('Promo')
  @Put('saved')
  @UseGuards(AuthGuard())
  async savePrintConfigs(@Body() body: SaveSelectedDto, @UserReq() user: User) {
    const { month, year, promos } = body;
    return await this.storePromoSelectedService.savePrintConfig(
      user.storeId,
      month,
      year,
      promos,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get saved promo' })
  @ApiResponse({ status: 200, description: 'saved print config' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiTags('Promo')
  @Get('saved')
  @UseGuards(AuthGuard())
  async getSaved(@Query() filter: GetSelectedDto, @UserReq() user: User) {
    const { month, year, includePromoDetails } = filter;
    try {
      const promos = await this.storePromoSelectedService.list(
        user.storeId,
        month,
        year,
        includePromoDetails,
      );
      let result = [];
      if (includePromoDetails === 'true') {
        result = promos.reduce((r, promo) => {
          const prm = Object.assign({}, promo, promo.promo);
          prm.printConfig.forEach((config, index) => {
            r.push(Object.assign({}, prm, config, { isAdded: index !== 0 }));
          });
          return r;
        }, []);
      } else {
        result = promos.map(promo => promo.promoId);
      }
      return result;
    } catch (e) {
      return e;
    }
  }

  @ApiTags('Promo-form')
  @Post('/types')
  @UseGuards(AuthGuard(), AdminGuard)
  async setPromoType(@Body() body: SavePromoTypeDto) {
    console.log('creating or updating promo type');
    return await this.promoService.createPromoType(
      body.type_ids,
      body.promo_id,
    );
  }
  // store promo mea
  @ApiOperation({ summary: 'Download mea list' })
  @ApiResponse({
    status: 200,
    description: 'Download promo mea excel to update state (reject or confirm)',
  })
  @ApiTags('Store-Promo-Mea')
  @Get('promo-mea/xl')
  @UseGuards(AuthGuard(), AdminGuard)
  async downloadFile(
    @Query(new DatesListValidationPipe()) filter: ListMeaToExportDto,
    @UserReq() user: User,
    @Res() res: any,
  ) {
    const filePath: string = await this.storePromoMeaService.exportExcelPromoState(
      filter,
      user,
    );
    res.status(200).download(filePath);
  }
  @ApiOperation({ summary: 'Download mea list' })
  @ApiResponse({
    status: 200,
    description: 'Download promo mea excel to update state (reject or confirm)',
  })
  @ApiOperation({ summary: 'update state mea list' })
  @ApiResponse({
    status: 200,
    description: 'Download promo mea excel to update state (reject or confirm)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiTags('Store-Promo-Mea')
  @Post('promo-mea/xl')
  @UseGuards(AuthGuard(), AdminGuard)
  @UseInterceptors(FileInterceptor('promosMeaFile', multerOptionsForMeaExcel))
  async uploadedFile(@UploadedFile() file) {
    if (!file) throw new BadRequestException('Make sure you upload a file');
    return await this.storePromoMeaService.updateMeaByExcel(file.path);
  }
  @ApiTags('Select list')
  @Get('promo-mea/labs')
  async getLabos(): Promise<any> {
    return await this.storePromoMeaService.getLabs().then(data => ({
      labLength: data.length,
      results: data.map(item => item.name),
    }));
  }

  @ApiOperation({ summary: 'Update promo mea state' })
  @ApiResponse({
    status: 200,
    description: 'update promo mea state Reject or Confirm ',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'missing reason for rejection' })
  @ApiResponse({ status: 404, description: 'promo not found' })
  @ApiTags('Store-Promo-Mea')
  @Post('promo-mea/:id/set-to')
  @UseGuards(AuthGuard(), StorePromoMeaGuard, StoreAdminGuard)
  @UsePipes(new RejectionReasonValidation())
  async changePromoState(@Body() body: SetStateDto, @Param('id') id: number) {
    return await this.storePromoMeaService.validateProof(
      id,
      body.store_id,
      body.reason_id,
      body.newState,
      body.state_id,
    );
  }

  @ApiOperation({ summary: 'upload mea proof sells list' })
  @ApiResponse({
    status: 200,
    description: 'upload sells list for promos mea as proof',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({
    name: 'store_id',
    description: 'required if admin',
    required: false,
    type: Number,
  })
  @ApiTags('Store-Promo-Mea')
  @Post('promo-mea/:id/upload-xl')
  @UseGuards(AuthGuard(), StorePromoMeaGuard, StoreAdminGuard)
  async uploadPromoMeaProofSellsList(
    @Req() req: any,
    @Res() res: any,
    @Param('id') id: number,
    @Query('store_id') storeId = req.user.storeId,
  ): Promise<any> {
    await this.storePromoMeaService.validatePromoState(id, storeId);
    this.meaUploadService.upload(req, res, async error => {
      if (error) {
        console.log(error);
        return res.status(404).json(`Failed to upload image file: ${error}`);
      }
      const parsed = url.parse(req.files[0].location, true);
      const location = parsed.path;
      await this.meaUploadService.afterUpload(id, storeId, null, location);
      const promo = await this.storePromoMeaService.doesPromoExist(id, storeId);
      res.status(200).json({
        satus: 200,
        data: snakeCaseKeys({
          ...promo,
          urlSellsListing: req.files[0].location,
        }),
      });
    });
  }

  @ApiOperation({ summary: 'upload mea proof' })
  @ApiResponse({
    status: 200,
    description: 'upload photo for promo mea as proof',
  })
  @ApiConsumes('multipart/form-data')
  @ApiTags('Store-Promo-Mea')
  @Post('promo-mea/:id')
  @UseInterceptors(FileInterceptor('justif', meaS3MulterOptions))
  @ApiFile('justif')
  @UseGuards(AuthGuard(), StorePromoMeaGuard, StoreAdminGuard)
  async uploadPromoMeaProofImage(
    @UploadedFile() file,
    @Param('id') id: number,
    @UserReq() user: User,
    @Query('store_id') storeId = user.storeId,
    @Req() req: any,
  ): Promise<any> {
    const promo = req.promo;
    this.logger.setContext(file);
    if (!file) throw new BadRequestException('please upload a file');
    await this.meaUploadService.afterUpload(id, storeId, file.key, null);
    return { ...promo, urlPicture: file.location };
  }

  @ApiOperation({ summary: 'toggle promo mea active' })
  @ApiResponse({
    status: 200,
    description: 'toggle promo mea active true/false',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiTags('Store-Promo-Mea')
  @Put('promo-mea/:id')
  @UseGuards(AuthGuard(), StoreAdminGuard)
  async togglePromosMeaActive(
    @Body() promo: ActiveToggleDto,
    @UserReq() user: User,
    @Param('id') id: number,
  ) {
    const storeId = promo.store_id || user.storeId;
    return await this.storePromoMeaService.toggleActive(
      id,
      storeId,
      promo.active,
      promo.reason,
      promo.reason_id,
    );
  }

  @ApiOperation({ summary: 'Get promo by id' })
  @ApiResponse({
    status: 200,
    description: 'toggle promo mea active true/false',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({
    name: 'store_id',
    description: 'the promo store id, required if admin',
    required: false,
    type: Number,
  })
  @ApiTags('Store-Promo-Mea')
  @Get('promo-mea/:id')
  @UseGuards(AuthGuard(), StoreAdminGuard)
  async getPromoDetails(
    @Param('id') promoId: number,
    @UserReq() user: User,
    @Query('store_id') store_id: number,
  ) {
    const storeId = user.userRoleId === 1 ? store_id : user.storeId;
    const filter = new ListMeaDto();
    filter.store_id = storeId;
    this.logger.debug(
      `fetching promo_mea_id ${promoId} for the store cip ${storeId}`,
    );
    const promo = await this.storePromoMeaService
      .findPromos(filter, user, false, promoId)
      .then(data => {
        data.promo.endDate = refreshDate(
          data.promo.endDate,
          DAYS_AFTER_END_DATE,
        );
        return this.storePromoMeaService.correspondancePromo(data);
        // return data;
      });

    return promo;
  }

  @ApiOperation({ summary: 'list promo mea' })
  @ApiResponse({
    status: 200,
    description:
      'List promo Mea with month year or dates list,array of month & year',
  })
  @ApiTags('Store-Promo-Mea')
  @Get('promo-mea')
  @UseGuards(AuthGuard(), ClientGuard, StoreAdminGuard)
  async listAllMea(
    @Query(new DatesListValidationPipe()) filter: ListMeaDto,
    @UserReq() user: User,
  ): Promise<StorePromoMea[]> {
    if (user.userRoleId !== 1) filter.store_id = user.storeId;
    return await this.storePromoMeaService
      .findPromos(filter, user, false, null, true)
      .then(result => {
        const data = result.data.map(item => {
          item.promo.endDate = refreshDate(
            item.promo.endDate,
            DAYS_AFTER_END_DATE,
          );
          return this.storePromoMeaService.correspondancePromo(item);
        });
        return { ...result, data };
      });
  }
  // end of store promo mea
  @ApiTags('Promo-form')
  @Post(':promoId/general')
  @UseGuards(AuthGuard(), AdminGuard)
  @UsePipes(new PromoValidationPipe(), new PromoTransformPipe())
  async savePromoGeneralInfo(
    @Param() param: PromoIdDto,
    @Body()
    body: PromoGeneralPromoDto,
  ) {
    const promo = await this.promoService.saveGeneralParams(
      param.promoId,
      body,
    );
    return promo;
  }

  @ApiTags('Promo-form')
  @Post(':promoId/achat')
  @UseGuards(AuthGuard(), AdminGuard)
  // @UsePipes(new PromoAchatValidationPipe())
  async savePromoAchat(
    @Param() param: PromoIdDto,
    @Body(new PromoAchatValidationPipe()) body: PromoAchatDto,
  ) {
    const promoAchat = await this.promoService.saveOpAchat(param.promoId, body);
    return promoAchat;
  }

  @ApiTags('Promo-form')
  @Post(':promoId/mea')
  @UseGuards(AuthGuard(), AdminGuard)
  @UsePipes(new PromoMeaEmplacementValidationPipe())
  async savePromoMea(@Param() param: PromoIdDto, @Body() body: PromoMeaDto) {
    const meaPromo = await this.promoService.saveMeaPromo(param.promoId, body);
    return meaPromo;
  }
  @ApiTags('Promo-form')
  @Post(':promoId')
  @UseGuards(AuthGuard(), AdminGuard)
  async DuplicatePromo(@Param() param: PromoIdDto, @UserReq() user: User) {
    return await this.promoService.duplicatePromo(param.promoId).then(promo => {
      return this.promoService.getPromos({}, user, promo.id).then(data => {
        if (data) return data;
        else return {};
      });
    });
  }
  // *****

  @ApiTags('Promo-form')
  @Put(':promoId')
  @UseGuards(AuthGuard(), AdminGuard)
  async updatePromoStatus(
    @Param() param: PromoIdDto,
    @Body('status_id') statusId: number,
  ) {
    return await this.promoService
      .updatePromo(param.promoId, statusId)
      .then(data => {
        if (data.raw.changedRows && statusId === 1) {
          this.logger.setContext(
            `fetching store promo mea for promo ${param.promoId}`,
          );
          this.emitter.emit('promoCreated', param.promoId);
        }
        return data;
      });
  }

  @ApiTags('Promo-form')
  @Delete(':promoId')
  @UseGuards(AuthGuard(), AdminGuard)
  async deletePromo(@Param() param: PromoIdDto) {
    return await this.promoService.delete(param.promoId);
  }
  @ApiTags('Promo-form')
  @Get(':promoId')
  @UseGuards(AuthGuard(), AdminGuard)
  getPromoById(@Param('promoId') promoId: number, @UserReq() user: User) {
    return this.promoService.getPromos({}, user, promoId).then(data => {
      if (data) return data;
      else return {};
    });
  }

  @ApiTags('Promo')
  @Get('/')
  @UseGuards(AuthGuard()) // , AdminGuard)
  async findAll(@Query() getPromoDto: GetPromoDto, @UserReq() user: User) {
    const promos = await this.promoService.getPromos(getPromoDto, user);
    if (getPromoDto.for_calendar)
      return this.pdfCalendarGeneratorService.promoKeysCorrespondant(
        promos,
        getPromoDto.type_off ?? 'MEA',
      );
    return promos;
  }
}
