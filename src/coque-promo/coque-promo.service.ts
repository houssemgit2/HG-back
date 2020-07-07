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

@Injectable()
export class CoquePromoService {
  constructor(private coquePromoRepository: CoquePromoRepository) {}
  updateCoque() {
    throw new Error('Method not implemented.');
  }
  logger = new Logger('Coque COntroller');
  async addCoque(coque: CreateCoqueDto, files) {
    try {
      this.logger.debug('start serializing data');
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
      console.log(coque.clusters);
      console.log(clusters);
      const periods: any = coque.periods.map(item => {
        const coquePeriod = new CoquePromoPeriods();
        coquePeriod.month = item.month;
        coquePeriod.year = item.year;
      });
      const result = await this.coquePromoRepository.addNew(
        coquePromo,
        coqueFiles,
        clusters,
        periods,
      );
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  listAll() {
    throw new Error('Method not implemented.');
  }
}
