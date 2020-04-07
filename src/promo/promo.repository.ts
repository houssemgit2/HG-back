import { Promo } from './../entities/Promo';
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  async update(promo: Promo) {
    return await this.promoRepository.update(promo.id, promo);
  }

  async delete(id) {
    return await this.promoRepository.delete(id);
  }
}
