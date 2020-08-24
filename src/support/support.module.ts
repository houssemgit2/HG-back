import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportFile } from '../entities/SupportFile';
import { Support } from '../entities/Support';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Support, SupportFile]), AuthModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
