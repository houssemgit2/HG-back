import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaflet } from './../entities/Leaflet';
import { Module } from '@nestjs/common';
import { LeafletService } from './leaflet.service';
import { LeafletController } from './leaflet.controller';
import { OrderUploadModule } from './../order-upload/order-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Leaflet]), OrderUploadModule],
  providers: [LeafletService],
  controllers: [LeafletController],
})
export class LeafletModule {}
