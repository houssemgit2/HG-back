import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaflet } from './../entities/Leaflet';
import { Module } from '@nestjs/common';
import { LeafletService } from './leaflet.service';
import { LeafletController } from './leaflet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leaflet])],
  providers: [LeafletService],
  controllers: [LeafletController],
})
export class LeafletModule {}
