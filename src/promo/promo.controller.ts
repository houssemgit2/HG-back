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

@ApiBearerAuth()
@ApiTags('Promo')
@Controller('promo')
export class PromoController {
  constructor(
    private readonly promoService: PromoService,
    private pdfPromoGeneratorService: PdfPromoGeneratorService,
  ) {}

  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
  async findAll(@Query() getPromoDto: GetPromoDto) {
    return await this.promoService.getAll(getPromoDto);
  }
  @Post('generate/promos')
  @Header('Content-Type', 'image/pdf')
  @Header('Content-Disposition', 'attachment; filename=promos.pdf')
  async generatePromos(@Body() body: any) {
    console.log(body.promos);
    const file: string = await this.pdfPromoGeneratorService.generatePDF(
      body.promos,
    );
    console.log(file);
    return fs.createReadStream(file);
  }
}
