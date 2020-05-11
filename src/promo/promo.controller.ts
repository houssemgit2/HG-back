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

@ApiBearerAuth()
@ApiTags('Promo')
@Controller('promo')
export class PromoController {
  constructor(
    private readonly promoService: PromoService,
    private pdfPromoGeneratorService: PdfPromoGeneratorService,
    private rejectionReasonService: RejectionReasonService,
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
}
