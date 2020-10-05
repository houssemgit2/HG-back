import { LefletPeriodService } from './../leflet-period/leflet-period.service';
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
    private lefletPeriodService: LefletPeriodService,
  ) {}

  logger = new Logger('leaflet service');

  async create(leaflet: AddLeafletDto) {
    try {
      const periodData = await this.lefletPeriodService.findOrCreate(
        leaflet.period,
        leaflet.year,
      );

      const newLeaflet = {
        periodId: periodData.id,
        condEl: leaflet.cond_el,
        price: leaflet.price,
        lab: leaflet.lab,
        libelle: leaflet.libelle,
        gamme: leaflet.gamme,
        qteLot: leaflet.qte_lot,
        unit: leaflet.unit,
        contenance: leaflet.contenance,
      };

      const result = await this.leafletRepository.save(newLeaflet);
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
    return await this.leafletRepository.findOne(id, {
      relations: ['period'],
    });
  }
  async update(id: number, leaflet: AddLeafletDto): Promise<UpdateResult> {
    let periodId;
    try {
      const updateLeaflet = {
        periodId,
        condEl: leaflet.cond_el,
        price: leaflet.price,
        lab: leaflet.lab,
        libelle: leaflet.libelle,
        gamme: leaflet.gamme,
        qteLot: leaflet.qte_lot,
        unit: leaflet.unit,
        contenance: leaflet.contenance,
      };

      return await this.leafletRepository.update(id, updateLeaflet);
    } catch (e) {
      return e;
    }
  }

  async remove(id): Promise<DeleteResult> {
    return await this.leafletRepository.delete(id);
  }
  async downloadOrders(ordersIDs): Promise<any> {
    let promises;
    const filesPath = `${__dirname}/output/ordersZips/${uuidv1()}`;
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
