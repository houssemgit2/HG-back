/* eslint-disable @typescript-eslint/camelcase */
import { GetSelectedDto } from './dto/get-selected.dto';
import { SaveSelectedDto } from './dto/save-selected.dto';
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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard, StoreAdminGuard } from '../auth/guards/admin.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { PromoService } from './promo.service';
import { GetPromoDto } from './dto/get-promo.dto';
import { PdfPromoGeneratorService } from '@app/pdf-promo-generator';
import { RejectionReasonService } from 'src/rejection-reason/rejection-reason.service';
import { StorePromoSelectedService } from './../store-promo-selected/store-promo-selected.service';

import { StorePromoMeaService } from '../store-promo-mea/store-promo-mea.service';
import { ListMeaDto } from '../store-promo-mea/dto/list-mea.dto';
import { StorePromoMea } from '../entities/StorePromoMea';
import { ActiveToggleDto } from '../store-promo-mea/dto/active-toggle.dto';
import { MeaUploadService } from 'src/mea-upload/mea-upload.service';
import * as url from 'url';
import { SetStateDto } from 'src/store-promo-mea/dto/setState.dto';
import { DatesListValidationPipe } from 'src/common/pipes/dates.validation.pipe';
import { RejectionReasonValidation } from 'src/common/pipes/rejection-reason.pipe';
import { ListMeaToExportDto } from 'src/store-promo-mea/dto/list-mea-for-export.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { User } from '../entities/User';
import { UserReq } from '../auth/get-user.decorator';
import { convertToSnakeCase } from 'src/common/utils/helpers';

const multerOptionsForMeaExcel: MulterOptions = multerOptions(
  /xlsm|xlsx|xlsb|xls|xla|xlml|ods|csv|.xlsx|csv/,
  `${__dirname}/../uploads/mea-state/`,
);
@ApiBearerAuth()
@ApiTags('Promo')
@Controller('promos')
export class PromoController {
  constructor(
    private readonly promoService: PromoService,
    private pdfPromoGeneratorService: PdfPromoGeneratorService,
    private rejectionReasonService: RejectionReasonService,
    private storePromoSelectedService: StorePromoSelectedService,
    private storePromoMeaService: StorePromoMeaService,
    private meaUploadService: MeaUploadService,
  ) {}
  logger = new Logger('promo controller');

  @Get()
  @UseGuards(AuthGuard()) // , AdminGuard)
  async findAll(@Query() getPromoDto: GetPromoDto) {
    return await this.promoService.getAll(getPromoDto);
  }

  @Post('generate/promos')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment; filename=promos.pdf')
  async generatePromos(@Body() body: any, @Res() response) {
    const file: string = await this.pdfPromoGeneratorService.generatePDF(
      body.promos,
    );
    return fs.createReadStream(file).pipe(response);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reasons List' })
  @ApiResponse({ status: 200, description: 'list all rejection reason' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('promo-mea-reason')
  @UseGuards(AuthGuard())
  async findRejectionReasons() {
    return await this.rejectionReasonService.getAll().then(data =>
      data.map(item => {
        item.label = item.name;
        return item;
      }),
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add reason' })
  @ApiResponse({ status: 200, description: 'add new rejection reason' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('promo-mea-reason')
  @UseGuards(AuthGuard())
  async addRejectionReasons(@Body() body: any) {
    const { name } = body;
    return await this.rejectionReasonService.add(name);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'saved promo' })
  @ApiResponse({ status: 200, description: 'saved promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'list labs' })
  @ApiResponse({ status: 200, description: 'list laboratories' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('promo-mea/labs')
  @UseGuards(AuthGuard())
  async listLabs() {
    const results = await this.storePromoMeaService
      .listLabs()
      .then(data => data.map(item => item.name));
    return { results, labLength: results.length };
  }

  @ApiOperation({ summary: 'list promo mea' })
  @ApiResponse({
    status: 200,
    description:
      'List promo Mea with month year or dates list,array of month & year',
  })
  @Get('promo-mea')
  @UseGuards(AuthGuard(), StoreAdminGuard)
  @UsePipes(new DatesListValidationPipe())
  async listAllMea(
    @Query() filter: ListMeaDto,
    @UserReq() user: User,
  ): Promise<StorePromoMea[]> {
    if (user.userRoleId !== 1) filter.store_id = user.storeId;
    return await this.storePromoMeaService.findPromos(
      filter,
      user,
      false,
      null,
      true,
    );
  }

  @ApiOperation({ summary: 'Download mea list' })
  @ApiResponse({
    status: 200,
    description: 'Download promo mea excel to update state (reject or confirm)',
  })
  @Get('promo-mea/xl')
  @UseGuards(AuthGuard(), AdminGuard)
  @UsePipes(new DatesListValidationPipe())
  // @UseInterceptors(FileInterceptor('image'))
  async downloadFile(
    @UploadedFile() file,
    @Query() filter: ListMeaToExportDto,
    @UserReq() user: User,
    @Res() res: any,
  ) {
    const filePath: string = await this.storePromoMeaService.exportExcelPromoState(
      filter,
      user,
    );
    res.status(200).download(filePath);
  }

  @ApiOperation({ summary: 'update state mea list' })
  @ApiResponse({
    status: 200,
    description: 'Download promo mea excel to update state (reject or confirm)',
  })
  @ApiConsumes('multipart/form-data')
  @Post('promo-mea/xl')
  @UseGuards(AuthGuard(), AdminGuard)
  @UseInterceptors(FileInterceptor('promosMeaFile', multerOptionsForMeaExcel))
  async uploadedFile(@UploadedFile() file) {
    return await this.storePromoMeaService.updateMeaByExcel(file.path);
  }

  @ApiOperation({ summary: 'Update promo mea state' })
  @ApiResponse({
    status: 200,
    description: 'update promo mea state Reject or Confirm ',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 400, description: 'missing reason for rejection' })
  @ApiResponse({ status: 404, description: 'promo not found' })
  @Post('promo-mea/:id/set-to')
  @UseGuards(AuthGuard(), StoreAdminGuard)
  @UsePipes(new RejectionReasonValidation())
  async changePromoState(@Body() body: SetStateDto, @Param('id') id: number) {
    return await this.storePromoMeaService.validateProof(
      id,
      body.store_id,
      body.reason,
      body.state,
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
  @Post('promo-mea/:id/upload-xl')
  @UseGuards(AuthGuard(), StoreAdminGuard)
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
      res.status(201).json(promo);
    });
  }

  @ApiOperation({ summary: 'upload mea proof' })
  @ApiResponse({
    status: 200,
    description: 'upload photo for promo mea as proof',
  })
  @ApiConsumes('multipart/form-data')
  @Post('promo-mea/:id')
  @UseGuards(AuthGuard(), StoreAdminGuard)
  async uploadPromoMeaProofImage(
    @Req() req: any,
    @Res() res: any,
    @Param('id') id: number,
    @UserReq() user: User,
    @Query('store_id') storeId = user.storeId,
  ): Promise<any> {
    await this.storePromoMeaService.validatePromoState(id, storeId);
    this.meaUploadService.upload(req, res, async error => {
      if (error) {
        console.log(error);
        return res.status(404).json(`Failed to upload image file: ${error}`);
      }
      // location = ;
      const parsed = url.parse(req.files[0].location, true);
      const location = parsed.path;
      await this.meaUploadService.afterUpload(id, storeId, location, null);
      const promo = await this.storePromoMeaService
        .doesPromoExist(id, storeId)
        .then(data => {
          data.urlPicture = req.files[0].location;
          return data;
        });
      res.status(200).json({
        statusCode: 200,
        data: convertToSnakeCase(promo),
      });
      // return promo;
    });
  }

  @ApiOperation({ summary: 'toggle promo mea active' })
  @ApiResponse({
    status: 200,
    description: 'toggle promo mea active true/false',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @Get('promo-mea/:id')
  @UseGuards(AuthGuard(), StoreAdminGuard)
  async getPromoDetails(
    @Param('id') promoId: number,
    @UserReq() user: User,
    @Query('store_id') store_id = user.storeId,
  ) {
    const storeId = store_id || user.storeId;
    const filter = new ListMeaDto();
    filter.store_id = storeId;
    this.logger.debug(
      `fetching promo_mea_id ${promoId} for the store cip ${storeId}`,
    );
    return await this.storePromoMeaService.findPromos(
      filter,
      user,
      false,
      promoId,
    );
  }
}
