import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Support } from 'src/entities/Support';
import { Repository } from 'typeorm';
import { SupportFile } from '../entities/SupportFile';
import { SupportDto } from './dto/sensSupport.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private supportRepository: Repository<Support>,
    @InjectRepository(SupportFile)
    private supportFileRepository: Repository<SupportFile>,
  ) {}
  logger = new Logger('Support');
  async sendSupport(support: SupportDto, email: string) {}
  async saveSupport() {}
}
