import { Injectable } from '@nestjs/common';
import { Cluster } from '../entities/Cluster';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClustersService {
  constructor(
    @InjectRepository(Cluster)
    private clustersRepository: Repository<Cluster>,
  ) {}
  async getAll() {
    return await this.clustersRepository.find();
  }
}
