import { Module } from '@nestjs/common';
import { MeaUploadService } from './mea-upload.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [MeaUploadService],
  exports: [MeaUploadService],
})
export class MeaUploadModule {}
