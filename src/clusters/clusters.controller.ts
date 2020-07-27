import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClustersService } from './clusters.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Coque-promo')
@ApiBearerAuth()
@Controller('clusters')
export class ClustersController {
  constructor(private readonly clustersService: ClustersService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getClusters(): Promise<any> {
    const clusters = await this.clustersService.getAll();
    return clusters.map(item => ({ ...item, descr: item.name }));
  }
}
