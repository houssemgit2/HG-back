import { Repository, EntityRepository } from 'typeorm';
import { RejectionReason } from '../entities/RejectionReason';
import { Logger, BadRequestException } from '@nestjs/common';

@EntityRepository(RejectionReason)
export class RejectionReasonRepository extends Repository<RejectionReason> {
  constructor(private rejectionReasonRepository: Repository<RejectionReason>) {
    super();
  }
  logger = new Logger('Rejection Reason Repo');
  async findAll() {
    return await this.find();
  }
  async getReasonId(name: string): Promise<RejectionReason> {
    const reason = await this.findOne({ name }, { select: ['id'] });
    this.logger.debug('reaosn return ' + reason);
    if (!reason)
      throw new BadRequestException(
        'this reason is not from the reasons list, add it to database then use it',
      );
    return reason;
  }
}
