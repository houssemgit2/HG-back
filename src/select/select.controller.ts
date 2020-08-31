import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SelectService } from './select.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Product } from '../entities/Product';
import { ProductDto } from '../promo/dto/product.dto';

@ApiBearerAuth()
@Controller('')
export class SelectController {
  constructor(private readonly appService: SelectService) {}

  @ApiTags('Select list')
  @Get('/products')
  async getProduct(@Query('name') name: string): Promise<Product[]> {
    return await this.appService.getProduct(name);
  }

  @ApiTags('Select list')
  @Post('/products')
  async addProduct(@Body() body: ProductDto): Promise<any> {
    return await this.appService.addProduct(body);
  }
}
