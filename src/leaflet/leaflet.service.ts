import { GetLeafletDto } from './dto/get-leaflet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Leaflet } from './../entities/Leaflet';
import { AddLeafletDto } from './dto/add-leaflet.dto';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateResult, DeleteResult, Repository } from 'typeorm';

@Injectable()
export class LeafletService {
  constructor(
    @InjectRepository(Leaflet)
    private leafletRepository: Repository<Leaflet>,
  ) {}

  logger = new Logger('leaflet service');

  async create(leaflet: AddLeafletDto) {
    this.logger.debug('adding new leaflet');
    try {
      const result = await this.leafletRepository.save(leaflet);
      return result;
    } catch (e) {
      return e;
    }
  }
  async getAll(filter: GetLeafletDto) {
    const { perPage, page } = filter;
    const sqlQuery = this.leafletRepository.createQueryBuilder('l');

    if (perPage && page) {
      sqlQuery.skip(perPage * (page - 1)).take(perPage);
    }

    try {
      const result = await sqlQuery.getMany();
      return result;
    } catch (e) {
      return e;
    }
  }
  async get(id: number) {
    return await this.leafletRepository.findOne(id);
  }
  async update(id: number, leaflet: AddLeafletDto): Promise<UpdateResult> {
    return await this.leafletRepository.update(id, leaflet);
  }

  async remove(id): Promise<DeleteResult> {
    return await this.leafletRepository.delete(id);
  }
}
