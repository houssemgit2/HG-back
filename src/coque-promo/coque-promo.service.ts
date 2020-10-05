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
import { getConnection, In, UpdateResult, DeleteResult } from 'typeorm';
import { GetFilesDto } from './dto/list-files.dto';
import { User } from 'src/entities/User';
import { CoqueFileIdDto } from './dto/coqueFileId.dto';
import { UpdateCoqueFileDto } from './dto/update-file.dto';
import { createPromiseFile } from 'src/common/utils/helpers';
import { v1 as uuidv1 } from 'uuid';
import * as allSettled from 'promise-all-settled';

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
      coque.status || coque.status === false || coque.name
        ? { ...coque }
        : null;
    this.logger.verbose(`coque promo update name and status`);
    console.log(coquePromo);
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
        status: 0,
      }));
      this.logger.debug('files ---->');
      console.log(coqueFiles);
      const coquePromo = new CoquePromo();
      coquePromo.name = coque.name;
      coquePromo.status = false;
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
    return await this.coquePromoRepository.findCoque(
      filter.coque_status,
      filter.file_status,
      filter.periods,
      filter.clusters,
    );
  }
  async getCoque(id: number, user: User) {
    try {
      const status = user.userRoleId !== 1 ? true : null;
      const fileStatus = user.userRoleId !== 1 ? true : null;
      const clusters =
        // eslint-disable-next-line @typescript-eslint/camelcase
        user.userRoleId !== 1 ? [{ cluster_id: user.store.clusterId }] : null;
      const coque = await this.coquePromoRepository.findCoque(
        status,
        fileStatus,
        null,
        clusters,
        true,
        id,
      );
      return coque;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async delete(coqueId: number) {
    try {
      return await this.coquePromoRepository.deleteCoque(coqueId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async deleteFiles(fileId: number) {
    const result: DeleteResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(CoquePromoFiles)
      .where({ id: fileId })
      .execute();
    return result.affected
      ? 'coque file deleted successfully'
      : 'no coque file deleted';
  }
  async listFiles(coqueId: number, filter: GetFilesDto, user: User) {
    try {
      const findConditions: any = { where: {} };
      if (user.userRoleId !== 1) findConditions.where.status = 1;
      else findConditions.where.status = filter.status;
      if (filter.idsList && filter.idsList.length)
        findConditions.where.id = In(filter.idsList);
      const coqueFiles = await getConnection()
        .getRepository(CoquePromoFiles)
        .find({ where: { coquePromoId: coqueId, ...findConditions } });
      return coqueFiles;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async downloadFiles(coqueId: number, filter: GetFilesDto, user: User) {
    const filesPath = `${__dirname}/output/coqueZips/${uuidv1()}`;
    const filesList = await this.listFiles(coqueId, filter, user).then(data =>
      data.map(item => {
        item.fileUrl = `${process.env.AWS_S3_BASE_URL}/${item.fileUrl}`;
        return item;
      }),
    );
    console.log(filesList);
    const promises = await createPromiseFile(
      filesPath,
      null,
      filesList,
      'name',
      'fileUrl',
    );
    await allSettled(promises, { onlyFulfilled: true });
    return filesPath;
  }
  async addFile(coquePromoId: number, file: any) {
    try {
      file.coquePromoId = coquePromoId;
      file.status = false;
      return await getConnection()
        .getRepository(CoquePromoFiles)
        .save(file);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async editCoqueFile(
    coqueCred: CoqueFileIdDto,
    data: UpdateCoqueFileDto,
  ): Promise<UpdateResult> {
    try {
      return await getConnection()
        .getRepository(CoquePromoFiles)
        .update(coqueCred.fileId, {
          status: data.status,
          name: data.filesName,
        });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
