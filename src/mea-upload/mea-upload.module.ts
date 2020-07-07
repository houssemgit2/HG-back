import { Module } from '@nestjs/common';
import { MeaUploadService } from './mea-upload.service';

@Module({
  providers: [MeaUploadService],
  exports: [MeaUploadService],
})
export class MeaUploadModule {}
