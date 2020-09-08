import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { SelectService } from './select.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Product } from '../entities/Product';
import { AddProductDto } from './dto/addProduct.dto';
import { GetProductDto } from './dto/get-product.dto';
import { GetGammeDto } from './dto/get-gamme.dto';
import { Gamme } from '../entities/Gamme';
import { DiscountDto } from './dto/discount.dto';
import { SelectStaticDto } from './dto/select-static.dto';
import { SelectValidationPipe } from '../common/pipes/select.pipe';

@ApiBearerAuth()
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
