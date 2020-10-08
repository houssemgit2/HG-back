import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Gamme } from '../entities/Gamme';
import { Product } from '../entities/Product';
import { SelectValidationPipe } from '../common/pipes/select.pipe';

import { SelectService } from './select.service';

import { AddProductDto } from './dto/addProduct.dto';
import { DiscountDto } from './dto/discount.dto';
import { GetGammeDto } from './dto/get-gamme.dto';
import { GetProductDto } from './dto/get-product.dto';
import { SelectStaticDto } from './dto/select-static.dto';

@UseGuards(AuthGuard())
@Controller('')
export class SelectController {
  constructor(private readonly appService: SelectService) {}

  @ApiTags('Select list')
  @Get('/products')
  async getProduct(@Query() query: GetProductDto): Promise<Product[]> {
    return await this.appService.getProduct(query);
  }

  @ApiTags('Select list')
  @Post('/products')
  async addProduct(@Body() body: AddProductDto): Promise<any> {
    return await this.appService.addProduct(body);
  }

  @ApiTags('Select list')
  @Get('/gamme')
  async getGamme(@Query() query: GetGammeDto): Promise<Gamme[]> {
    return await this.appService.getGamme(query);
  }

  @ApiTags('Select list')
  @Get('/laboratories')
  async getLabos(@Query() { name, id }: DiscountDto): Promise<any[]> {
    return await this.appService.getLabos(name);
  }

  @ApiTags('Select list')
  @Get('/select')
  @UsePipes(new SelectValidationPipe())
  async getRemunerationUnit(@Query() query: SelectStaticDto) {
    return await this.appService.GetByName(
      {
        entityTarget: query.targetEntity,
        name: query.entityName,
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/discounts')
  async getDiscount(@Query() query: DiscountDto) {
    return await this.appService.getDiscount(query);
  }
}
