import { Repository, EntityRepository } from 'typeorm';
import { RejectionReason } from '../entities/RejectionReason';

@EntityRepository(RejectionReason)
export class RejectionReasonRepository extends Repository<RejectionReason> {
  constructor(private rejectionReasonRepository: Repository<RejectionReason>) {
    super();
  }
  async findAll() {
    return await this.find();
  }
}
