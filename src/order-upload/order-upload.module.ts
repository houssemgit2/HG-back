import { Module } from '@nestjs/common';
import { OrderUploadService } from './order-upload.service';

@Module({
  providers: [OrderUploadService],
  exports: [OrderUploadService],
})
export class OrderUploadModule {}
