import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoRepository } from './promo.repository';
// Entity
import { Promo } from './../entities/Promo';
// DTO
// import { PromoDto } from './dto/promo.dto';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoRepository)
    private readonly promoRepository: PromoRepository,
  ) {}

  async getAll(): Promise<Promo[]> {
    try {
      return await this.promoRepository.find({});
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
