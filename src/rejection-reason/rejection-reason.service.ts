import { Injectable } from '@nestjs/common';
import { RejectionReasonRepository } from './rejection-reason.repository';
import { RejectionReason } from '../entities/RejectionReason';

@Injectable()
export class RejectionReasonService {
  constructor(private rejectionReasonRepository: RejectionReasonRepository) {}
  async getAll() {
    try {
      return await this.rejectionReasonRepository.findAll();
    } catch (e) {
      return e;
    }
  }

  async add(reason: string) {
    try {
      const rejectionReason = new RejectionReason();
      rejectionReason.name = reason;
      return await this.rejectionReasonRepository.save(rejectionReason);
    } catch (e) {
      return e;
    }
  }
}
