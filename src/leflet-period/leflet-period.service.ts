import { GetLeafletPeriodDto } from './dto/get-leaflet-period.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LeafletPeriod } from './../entities/LeafletPeriod';
import { UpdateResult, DeleteResult } from 'typeorm';
import { AddLeafletPeriodDto } from './dto/add-leaflet-period.dto';
import { User } from 'src/entities/User';

@Injectable()
export class LefletPeriodService {
  constructor(
    @InjectRepository(LeafletPeriod)
    private leafletPeriodRepository: Repository<LeafletPeriod>,
  ) {}
  async getAll(filter: GetLeafletPeriodDto, user: User): Promise<{}> {
    const sqlQuery = this.leafletPeriodRepository
      .createQueryBuilder('lp')
      .leftJoinAndSelect('lp.leaflets', 'leaflets')
      .orderBy('lp.calendar_period', 'ASC');
    if (user.userRole.name === 'client') {
      sqlQuery.where({ enabled: 1 });
    }

    if (filter.perPage && filter.page) {
      sqlQuery.skip(filter.perPage * (filter.page - 1)).take(filter.perPage);
    }
    const result = await sqlQuery.getMany();
    const newResult = result.map(period => {
      const newPeriod = {
        ...period,
        count: period.leaflets.length,
      };
      delete newPeriod.leaflets;
      return newPeriod;
    });

    const groupByYear = newResult.reduce((r, a) => {
      r[a.year] = [...(r[a.year] || []), a];

      return r;
    }, {});
    return groupByYear;
  }

  async create(leafletPeriod: AddLeafletPeriodDto): Promise<LeafletPeriod> {
    return await this.leafletPeriodRepository.save(leafletPeriod);
  }

  findOne(id: number): Promise<LeafletPeriod> {
    return this.leafletPeriodRepository.findOne(id);
  }

  //   async update(leafletPeriod: LeafletPeriod): Promise<UpdateResult> {
  //     return await this.leafletPeriodRepository.update(
  //       leafletPeriod.id,
  //       leafletPeriod,
  //     );
  //   }

  async delete(id): Promise<DeleteResult> {
    return await this.leafletPeriodRepository.delete(id);
  }
}
