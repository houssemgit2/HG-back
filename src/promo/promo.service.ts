import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity
import { Promo } from './../entities/Promo';
// DTO
import { GetPromoDto } from './dto/get-promo.dto';
@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(Promo)
    private promoRepository: Repository<Promo>,
  ) {}

  async getAll(filter): Promise<Promo[]> {
    try {
      return await this.promoRepository.find({ where: filter });
    } catch (err) {
      return err;
    }
  }

  //   async findById(id: string): Promise<Promo> {
  //     try {
  //       return await this.promoRepository.findOneById(id);
  //     } catch (err) {
  //       return err;
  //     }
  //   }

  async delete(id: string) {
    try {
      return await this.promoRepository.delete(id);
    } catch (err) {
      return err;
    }
  }
}
