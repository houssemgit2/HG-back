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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('promo')
export class PromoController {
  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return 'This action returns all promos';
  }
}
