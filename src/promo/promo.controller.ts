import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Delete,
  Put,
  Query,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Header,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { PromoService } from './promo.service';
import { GetPromoDto } from './dto/get-promo.dto';
import { PdfPromoGeneratorService } from '@app/pdf-promo-generator';
import { RejectionReasonService } from 'src/rejection-reason/rejection-reason.service';
import { ReqWithUser } from '../auth/interface/user.interface';
import { StorePromoSelectedService } from './../store-promo-selected/store-promo-selected.service';

@ApiBearerAuth()
@ApiTags('Promo')
@Controller('promo')
export class PromoController {
  constructor(
    private readonly promoService: PromoService,
    private pdfPromoGeneratorService: PdfPromoGeneratorService,
    private rejectionReasonService: RejectionReasonService,
    private storePromoSelectedService: StorePromoSelectedService,
  ) {}

  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
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
    return await this.rejectionReasonService.getAll();
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
  async saveSelected(@Body() body: any, @Req() req: ReqWithUser) {
    const { month, year, promos } = body;
    return await this.storePromoSelectedService.savedPromos(
      req.user.storeId,
      month,
      year,
      promos,
    );
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'saved print config' })
  @ApiResponse({ status: 200, description: 'saved print config' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put()
  @UseGuards(AuthGuard())
  async savePrintConfigs(@Body() body: any, @Req() req: ReqWithUser) {
    const { month, year, promos } = body;
    return await this.storePromoSelectedService.savePrintConfig(
      req.user.storeId,
      month,
      year,
      promos,
    );
  }
}
