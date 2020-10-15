import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Repository, getConnection, ObjectType } from 'typeorm';
import { BaseEntity } from 'typeorm';

import { AchatAdvantageDiscountType } from '../entities/AchatAdvantageDiscountType';
import { AchatSubAdvantageDiscountType } from '../entities/AchatSubAdvantageDiscountType';
import { Gamme } from '../entities/Gamme';
import { Laboratory } from '../entities/Laboratory';
import { OperationType } from '../entities/OperationType';
import { Product } from '../entities/Product';

import { AddProductDto } from './dto/addProduct.dto';
import { DiscountDto } from './dto/discount.dto';
import { GetGammeDto } from './dto/get-gamme.dto';
import { GetProductDto } from './dto/get-product.dto';

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
    try {
      const productCondition: any = {};
      if (product.name) productCondition.name = Like(`%${product.name}%`);
      if (product.ean) productCondition.ean = Like(`%${product.ean}%`);
      if (product.gamme_id) productCondition.gammeId = product.gamme_id;
      return await this.productRepository.find(productCondition);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addProduct(product: AddProductDto): Promise<any> {
    try {
      if (product.id) delete product.id;
      return await this.productRepository.save(product);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async getGamme(gamme: GetGammeDto): Promise<Gamme[]> {
    try {
      const gammeCondition: any = {};
      if (gamme.name) gammeCondition.name = Like(`%${gamme.name}%`);
      if (gamme.brand_id) gammeCondition.brandId = gamme.brand_id;

      return await this.gammeRepository.find(gammeCondition);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getLabos(name?: string): Promise<any[]> {
    try {
      const condition: any = {};
      if (name) condition.name = Like(`%${name}%`);
      return await this.laboratoryRepository.find(condition);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  getStaticElementId(
    name: string,
    entityTarget: ObjectType<BaseEntity>,
    entityName: string,
  ) {
    return getConnection()
      .createQueryBuilder()
      .select(entityName) // table, Entity, key
      .from(entityTarget, entityName)
      .where(`name = :name`, {
        name: `%${name.trim()}%`,
      })
      .getOne()
      .catch(e => {
        throw new InternalServerErrorException(e);
      })
      .then((item: any) => {
        if (!item)
          throw new BadRequestException(`there is no ${name} in ${entityName}`);
        else return item.id;
      });
  }

  async GetByName(
    entity: { entityTarget: ObjectType<BaseEntity>; name: string },
    name?: string,
  ) {
    try {
      const query = getConnection()
        .createQueryBuilder()
        .select(entity.name) // table, Entity, key
        .from(entity.entityTarget, entity.name);
      if (name)
        query.where(`name = :name`, {
          name: `%${name}%`,
        });
      return await query.getMany();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async getDiscount(query: DiscountDto) {
    try {
      const condition: any = {};
      if (query.id) condition.id = query.id;
      if (query.name) condition.name = Like(`%${query.name}%`);
      return await this.achatDiscountRepository.find({
        where: { ...condition },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
