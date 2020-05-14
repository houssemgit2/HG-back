import { GetLeafletDto } from './dto/get-leaflet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Leaflet } from './../entities/Leaflet';
import { AddLeafletDto } from './dto/add-leaflet.dto';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateResult, DeleteResult, Repository, In, Not } from 'typeorm';
import { v1 as uuidv1 } from 'uuid';
import * as fs from 'fs';
import * as request from 'request-promise';
import * as allSettled from 'promise-all-settled';

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
  async downloadOrders(ordersIDs): Promise<any> {
    let promises;
    const filesPath = `${__dirname}/../output/ordersZips/${uuidv1()}`;
    try {
      const leaflets = await this.leafletRepository.find({
        where: [
          { id: In(ordersIDs), urlOrder: Not(null) },
          { id: In(ordersIDs), urlOrder: Not('') },
        ],
      });
      console.log('leaflets', leaflets);
      await fs.mkdirSync(filesPath);
      promises = leaflets.map((leaflet, index) => {
        return new Promise((resolve, reject) => {
          const filepath = `${filesPath}/${index}-${leaflet.libelle.replace(
            '/',
            ' ',
          )}.pdf`;
          const file = fs.createWriteStream(filepath);
          request
            .get(`${leaflet.urlOrder}`)
            .pipe(file)
            .on('finish', () => {
              resolve(filepath);
            })
            .on('error', error => {
              reject(error);
            });
        });
      });
    } catch (e) {
      console.log(e);
    }
    await allSettled(promises, { onlyFulfilled: true });

    return filesPath;
  }
}
