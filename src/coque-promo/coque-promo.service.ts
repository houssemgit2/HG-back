import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CoquePromoRepository } from './coque-promo.repository';
import { CreateCoqueDto } from './dto/create-coque.dto';
import { CoquePromo } from '../entities/CoquePromo';
import { CoquePromoClusters } from '../entities/CoquePromoClusters';
import { CoquePromoPeriods } from '../entities/CoquePromoPeriods';
import { ListMeaDto } from './dto/list-coque.dto';
import { UpdateCoqueDto } from './dto/update.dto';
import { CoquePromoFiles } from '../entities/CoquePromoFiles';
import { getConnection, FindConditions, In } from 'typeorm';
import { GetFilesDto } from './dto/list-files.dto';
import { User } from 'src/entities/User';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CoquePromoService {
  constructor(private coquePromoRepository: CoquePromoRepository) {}
  logger = new Logger('Coque COntroller');
  async updateCoque(coqueId: number, coque: UpdateCoqueDto, files) {
    this.logger.verbose('start to update the coque');
    const coqueClusters =
      coque.clusters && coque.clusters.length
        ? coque.clusters.map(item => ({ clusterId: item.cluster_id }))
        : null;
    const coquePeriods =
      coque.periods && coque.periods.length ? coque.periods : null;
    const coqueFiles =
      files && files.length
        ? files.map((item, index) => ({
            name: coque.filesName[index],
            fileUrl: item.key,
            status: true,
          }))
        : null;
    const filesToRemove =
      coque.filesToRemove && coque.filesToRemove.length
        ? coque.filesToRemove
        : null;
    const coquePromo =
      coque.status || coque.name
        ? { name: coque.name, status: coque.status }
        : null;
    return await this.coquePromoRepository.updateCoque(
      coqueId,
      coquePromo,
      filesToRemove,
      coqueFiles,
      coqueClusters,
      coquePeriods,
    );
  }

  async addCoque(coque: CreateCoqueDto, files) {
    try {
      this.logger.debug('start serializing data');
      console.log(coque);
      const coqueFiles = files.map((item, index) => ({
        name: coque.filesName[index],
        fileUrl: item.key,
        status: 1,
      }));
      this.logger.debug('files ---->');
      console.log(coqueFiles);
      const coquePromo = new CoquePromo();
      coquePromo.name = coque.name;
      coquePromo.status = true;
      const clusters = coque.clusters.map(item => {
        const coqueCluster = new CoquePromoClusters();
        coqueCluster.clusterId = item.cluster_id;
        return coqueCluster;
      });
      this.logger.debug('clusters ---->');
      console.log(clusters);
      const periods: any = coque.periods.map(item => {
        const coquePeriod = new CoquePromoPeriods();
        coquePeriod.month = item.month;
        coquePeriod.year = item.year;
        return coquePeriod;
      });
      this.logger.debug('periods ---->');
      console.log(periods);

      const result = await this.coquePromoRepository.addNew(
        coquePromo,
        coqueFiles,
        clusters,
        periods,
      );
      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
  async listAll(filter: ListMeaDto) {
    return await this.coquePromoRepository.findAllCoque(
      filter.coque_status,
      filter.file_status,
      filter.periods,
      filter.clusters,
    );
  }
  async delete(coqueId: number) {
    try {
      return await this.coquePromoRepository.deleteCoque(coqueId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async deleteFiles(fileId: number) {
    return await getConnection()
      .createQueryBuilder()
      .delete()
      .from(CoquePromoFiles)
      .where({ id: fileId })
      .execute();
  }
  async listFiles(coqueId: number, filter: GetFilesDto, user: User) {
    try {
      const findConditions: any = { where: {} };
      if (user.userRoleId !== 1) findConditions.where.status = true;
      else findConditions.where.status = filter.status;
      if (filter.idsList && filter.idsList.length)
        findConditions.where.id = In(filter.idsList);
      return await getConnection()
        .getRepository(CoquePromoFiles)
        .find({ where: { coquePromoId: coqueId, ...findConditions } });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async addFile(
    coquePromoId: number,
    file: any,
  ) {
    try {
      file.coquePromoId = coquePromoId;
      file.status = true;
      return await getConnection()
        .getRepository(CoquePromoFiles)
        .save(file);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
