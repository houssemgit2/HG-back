import { Injectable } from '@nestjs/common';
import { Product } from '../entities/Product';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, getConnection, ObjectType } from 'typeorm';
import { Gamme } from '../entities/Gamme';
import { Laboratory } from '../entities/Laboratory';
import { AddProductDto } from './dto/addProduct.dto';
import { GetProductDto } from './dto/get-product.dto';
import { GetGammeDto } from './dto/get-gamme.dto';
import { OperationType } from '../entities/OperationType';
import { BaseEntity } from 'typeorm';
import { AchatAdvantageDiscountType } from '../entities/AchatAdvantageDiscountType';
import { AchatSubAdvantageDiscountType } from '../entities/AchatSubAdvantageDiscountType';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class SelectService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Gamme)
    private gammeRepository: Repository<Gamme>,

    @InjectRepository(Laboratory)
    private laboratoryRepository: Repository<Laboratory>,

    @InjectRepository(OperationType)
    private operationTypeRepository: Repository<OperationType>,

    @InjectRepository(AchatAdvantageDiscountType)
    private achatDiscountRepository: Repository<AchatAdvantageDiscountType>,

    @InjectRepository(AchatSubAdvantageDiscountType)
    private achatSubDiscountRepository: Repository<
      AchatSubAdvantageDiscountType
    >,
  ) {}

  async getProduct(product: GetProductDto): Promise<Product[]> {
    const productCondition: any = {};
    if (product.name) productCondition.name = Like(`%${product.name}%`);
    if (product.ean) productCondition.ean = Like(`%${product.ean}%`);
    if (product.gamme_id) productCondition.gammeId = product.gamme_id;
    return await this.productRepository.find(productCondition);
  }

  async addProduct(product: AddProductDto): Promise<any> {
    if (product.id) delete product.id;
    return await this.productRepository.save(product);
  }
  async getGamme(gamme: GetGammeDto): Promise<Gamme[]> {
    const gammeCondition: any = {};
    if (gamme.name) gammeCondition.name = Like(`%${gamme.name}%`);
    if (gamme.brand_id) gammeCondition.brandId = gamme.brand_id;

    return await this.gammeRepository.find(gammeCondition);
  }

  async getLabos(name?: string): Promise<any[]> {
    const condition: any = {};
    if (name) condition.name = Like(`%${name}%`);
    return await this.laboratoryRepository.find(condition);
  }
  async getOpTypes(name?: string): Promise<any[]> {
    const condition: any = {};
    if (name) condition.name = Like(`%${name}%`);
    return await this.laboratoryRepository.find(condition);
  }

  async GetByName(
    entity: { entityTarget: ObjectType<BaseEntity>; name: string },
    name?: string,
  ) {
    const query = getConnection()
      .createQueryBuilder()
      .select(entity.name) // table, Entity, key
      .from(entity.entityTarget, entity.name);
    if (name)
      query.where(`name = :name`, {
        name: `%${name}%`,
      });
    return await query.getMany();
  }
  async getDiscount(query: DiscountDto) {
    const condition: any = {};
    if (query.id) condition.id = query.id;
    if (query.name) condition.name = Like(`%${query.name}%`);
    return await this.achatDiscountRepository.find({ where: { ...condition } });
  }
}
