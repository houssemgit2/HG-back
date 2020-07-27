import { Module } from '@nestjs/common';
import { ClustersService } from './clusters.service';
import { ClustersController } from './clusters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cluster } from '../entities/Cluster';

@Module({
  imports: [TypeOrmModule.forFeature([Cluster]), AuthModule],

  providers: [ClustersService],
  controllers: [ClustersController],
})
export class ClustersModule {}
