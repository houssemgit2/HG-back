import { Injectable } from '@nestjs/common';
import { Product } from '../entities/Product';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Gamme } from '../entities/Gamme';
import { Laboratory } from '../entities/Laboratory';
import { ProductDto } from '../promo/dto/product.dto';

@Injectable()
export class SelectService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Gamme)
    private gammeRepository: Repository<Gamme>,

    @InjectRepository(Laboratory)
    private laboratoryRepository: Repository<Laboratory>,
  ) {}

  async getProduct(name: string): Promise<Product[]> {
    return await this.productRepository.find({ name: Like(`%${name}%`) });
  }

  async addProduct(product: ProductDto): Promise<any> {
    if (product.id) delete product.id;

    return await this.productRepository.save(product);
  }
}
