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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PromoService } from './promo.service';
import { GetPromoDto } from './dto/get-promo.dto';

@ApiBearerAuth()
@ApiTags('Promo')
@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
  async findAll(@Query() getPromoDto: GetPromoDto) {
    return await this.promoService.getAll(getPromoDto);
  }
}
