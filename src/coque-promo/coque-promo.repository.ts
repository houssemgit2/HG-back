import { CoquePromo } from '../entities/CoquePromo';
import { EntityRepository, Repository, Transaction } from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, In } from 'typeorm';
import { CoquePromoFiles } from '../entities/CoquePromoFiles';
import { CoquePromoClusters } from '../entities/CoquePromoClusters';
import { CoquePromoPeriods } from '../entities/CoquePromoPeriods';
import { Cluster } from '../entities/Cluster';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@EntityRepository(CoquePromo)
export class CoquePromoRepository extends Repository<CoquePromo> {
  logger = new Logger('Coque Repository');
  constructor(
    @InjectRepository(CoquePromo)
    private readonly coqueRepository: Repository<CoquePromo>,
  ) {
    super();
  }
  @Transaction()
  async deleteCoque(coqueId: number) {
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
  }

  async findAllCoque(
    status: boolean,
    fileStatus: boolean,
    periods: { month: number; year: number }[],
    cluster: { cluster_id: number }[],
  ) {
    const findConditions: any = {};
    if (status || status === false) findConditions.status = status;
    if (fileStatus || fileStatus === false)
      findConditions.clusterPromoFiles = { status: fileStatus };
    if (periods) findConditions.coquePromoPeriods = In(periods);
    if (cluster) findConditions.coquePromoClusters = In(cluster);
    return await this.find({
      where: findConditions,
      relations: [
        'coquePromoClusters',
        'coquePromoClusters.cluster',
        'coquePromoFiles',
        'coquePromoPeriods',
      ],
    });
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
      console.log(newCoque);
      const coquePromoId = newCoque.id;
      this.logger.debug('the new coque id is ****->');
      this.logger.verbose(`Coque id = ${coquePromoId}`);
      const newFiles: CoquePromoFiles[] = files.map(item => {
        const coqueFile = new CoquePromoFiles();
        coqueFile.coquePromoId = coquePromoId;
        coqueFile.status = true;
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
        year: item.month,
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
      const newCoque = await queryRunner.manager.update(
        CoquePromo,
        { id: coqueId },
        coquePromo,
      );
      if (filesToRemove) {
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
          coquePromoFiles.map(item =>
            queryRunner.manager.insert(CoquePromoClusters, coquePromoClusters),
          ),
        );
      }

      if (coquePromoPeriods) {
        await queryRunner.manager.delete(CoquePromoPeriods, {
          where: { coquePromoId: coqueId },
        });
        await Promise.all(
          coquePromoFiles.map(item =>
            queryRunner.manager.insert(CoquePromoPeriods, coquePromoPeriods),
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
