import { Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brackets, EntityRepository, Repository } from 'typeorm';
import { getConnection, In } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CoquePromo } from '../entities/CoquePromo';
import { CoquePromoClusters } from '../entities/CoquePromoClusters';
import { CoquePromoFiles } from '../entities/CoquePromoFiles';
import { CoquePromoPeriods } from '../entities/CoquePromoPeriods';

@EntityRepository(CoquePromo)
export class CoquePromoRepository extends Repository<CoquePromo> {
  logger = new Logger('Coque Repository');
  constructor(
    @InjectRepository(CoquePromo)
    private readonly coqueRepository: Repository<CoquePromo>,
  ) {
    super();
  }
  // @Transaction()
  async deleteCoque(coqueId: number) {
    try {
      await getConnection()
        .getRepository(CoquePromoFiles)
        .delete({ coquePromoId: coqueId });
      await getConnection()
        .getRepository(CoquePromoPeriods)
        .delete({ coquePromoId: coqueId });
      await getConnection()
        .getRepository(CoquePromoClusters)
        .delete({ coquePromoId: coqueId });
      await this.delete({ id: coqueId });
      return 'deleted successfully';
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async findCoque(
    status: boolean,
    fileStatus: boolean,
    periods: { month: number; year: number }[],
    clusters: { cluster_id: number }[],
    getOne = false,
    id?: number,
  ) {
    let query = this.createQueryBuilder('coque')
      .leftJoinAndSelect('coque.coquePromoClusters', 'coquePromoClusters')
      .leftJoinAndSelect('coque.coquePromoPeriods', 'coquePromoPeriods')
      .leftJoinAndSelect('coque.coquePromoFiles', 'coquePromoFiles')
      .leftJoinAndSelect('coquePromoClusters.cluster', 'cluster');
    if (getOne) query.where('coque.id =:id', { id });
    if (status || status === false)
      query = query.andWhere('coque.status = :status', { status });
    if (fileStatus || fileStatus === false)
      query = query.andWhere('coquePromoFiles.status = :status', {
        status: fileStatus,
      });
    if (periods && periods.length)
      query = query.andWhere(
        new Brackets(subQb => {
          periods.forEach((item, index) => {
            if (!index)
              subQb.where(
                'coquePromoPeriods.month = :month and coquePromoPeriods.month = :year',
                { ...item },
              );
            else
              subQb.orWhere(
                'coquePromoPeriods.month = :month and coquePromoPeriods.month = :year',
                { ...item },
              );
          });
        }),
      );
    if (clusters && clusters.length)
      query = query.andWhere(
        new Brackets(subQb => {
          clusters.forEach((item, index) => {
            if (!index)
              subQb.where('coquePromoClusters.clusterId = :cluster_id', {
                ...item,
              });
            else
              subQb.orWhere('coquePromoClusters.clusterId = :cluster_id', {
                ...item,
              });
          });
        }),
      );
    if (getOne) return await query.getOne();
    return await query.getMany();
  }
  async addNew(
    coquePromo: CoquePromo,
    files: CoquePromoFiles[],
    clusters: CoquePromoClusters[],
    periods: CoquePromoPeriods[],
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction ::');
    try {
      const coque = new CoquePromo();
      coque.name = coquePromo.name;
      coque.status = true;
      const newCoque = await queryRunner.manager.save(coque);
      // console.log(newCoque);
      const coquePromoId = newCoque.id;
      this.logger.debug('the new coque id is ****->');
      this.logger.verbose(`Coque id = ${coquePromoId}`);
      const newFiles: CoquePromoFiles[] = files.map(item => {
        const coqueFile = new CoquePromoFiles();
        coqueFile.coquePromoId = coquePromoId;
        coqueFile.status = false;
        coqueFile.fileUrl = item.fileUrl;
        return coqueFile;
      });
      await Promise.all(
        newFiles.map(item => queryRunner.manager.insert(CoquePromoFiles, item)),
      );

      const newClusters = clusters.map(item => ({
        clusterId: item.clusterId,
        coquePromoId,
      }));
      await Promise.all(
        newClusters.map(item =>
          queryRunner.manager.insert(CoquePromoClusters, item),
        ),
      );

      const newPeriods = periods.map(item => ({
        coquePromoId,
        month: item.month,
        year: item.year,
      }));
      await Promise.all(
        newPeriods.map(item =>
          queryRunner.manager.insert(CoquePromoPeriods, item),
        ),
      );
      await queryRunner.commitTransaction();
      return newCoque;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'failed to finish transaction' + err,
      );
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async updateCoque(
    coqueId: number,
    coquePromo: QueryDeepPartialEntity<CoquePromo> | null,
    filesToRemove: number[] | null,
    coquePromoFiles: QueryDeepPartialEntity<CoquePromoFiles>[] | null,
    coquePromoClusters: QueryDeepPartialEntity<CoquePromoClusters>[] | null,
    coquePromoPeriods: QueryDeepPartialEntity<CoquePromoPeriods>[] | null,
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction ::');
    try {
      if (coquePromo)
        await queryRunner.manager.update(
          CoquePromo,
          { id: coqueId },
          coquePromo,
        );
      if (filesToRemove && filesToRemove.length) {
        await queryRunner.manager.delete(CoquePromoFiles, {
          where: { id: In(filesToRemove) },
        });
      }
      if (coquePromoFiles) {
        await Promise.all(
          coquePromoFiles.map(item =>
            queryRunner.manager.insert(CoquePromoFiles, item),
          ),
        );
      }
      if (coquePromoClusters) {
        await queryRunner.manager.delete(CoquePromoClusters, {
          where: { coquePromoId: coqueId },
        });
        await Promise.all(
          coquePromoClusters.map(item =>
            queryRunner.manager.insert(CoquePromoClusters, item),
          ),
        );
      }

      if (coquePromoPeriods) {
        await queryRunner.manager.delete(CoquePromoPeriods, {
          where: { coquePromoId: coqueId },
        });
        await Promise.all(
          coquePromoPeriods.map(item =>
            queryRunner.manager.insert(CoquePromoPeriods, item),
          ),
        );
      }

      await queryRunner.commitTransaction();
      return 'coque updated successfully';
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'failed to finish transaction' + err,
      );
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
