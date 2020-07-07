import { CoquePromo } from 'src/entities/CoquePromo';
import {
  EntityRepository,
  Repository,
  Connection,
  FindManyOptions,
  FindConditions,
} from 'typeorm';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { CoquePromoFiles } from '../entities/CoquePromoFiles';
import { CoquePromoClusters } from '../entities/CoquePromoClusters';
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
  async findAllCoque(
    status: boolean,
    fileStatus: boolean,
    periods: { month: number; year: number },
    cluster: number,
  ) {
    const findOptions: FindManyOptions = {};
    const findConditions: any = {};
    if (status || status === false) findConditions.status = status;
    if (fileStatus || fileStatus === false)
      findConditions.cluster_promo_files.status = fileStatus;
    if (periods) findConditions.cluster_promo_periods.month = periods.month;
    if (periods) findConditions.cluster_promo_periods.year = periods.year;
    if (cluster) findConditions.cluster_promo_clusters.clusterId = cluster;
    await this.find({
      relations: [
        'coque_promo_clusters',
        'coque_promo_files',
        'coque_promo_periods',
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
      const newCoque = await queryRunner.manager.save(coquePromo, {});
      this.logger.log(`created coque with id ${newCoque.id}`);
      console.log(newCoque);
      const newFiles: CoquePromoFiles[] = files.map(item => {
        const coqueFile = new CoquePromoFiles();
        coqueFile.coquePromoId = newCoque.id;
        coqueFile.status = true;
        coqueFile.fileUrl = item.fileUrl;
        return coqueFile;
      });
      console.log(files);
      await queryRunner.manager.save(newFiles);
      this.logger.log(`created coque files with id `);

      clusters.map(item => (item.coquePromoId = newCoque.id));
      await queryRunner.manager.save(clusters);
      this.logger.log(`created coque clusters with id `);

      periods.map(item => (item.coquePromoId = newCoque.id));
      await queryRunner.manager.save(periods);
      this.logger.log(`created coque periods with id `);

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
}
