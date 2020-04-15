import { Repository, EntityRepository } from 'typeorm';
import { Promo } from '../entities/Promo';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPromoDto } from './dto/get-promo.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Promo)
export class PromoRepository extends Repository<Promo> {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
  ) {
    super();
  }
  async findAll(): Promise<Promo[]> {
    return await this.promoRepository.find();
  }
}
