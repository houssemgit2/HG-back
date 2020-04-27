import { Module } from '@nestjs/common';
import { PdfCalendarGeneratorService } from './pdf-calendar-generator.service';

@Module({
  providers: [PdfCalendarGeneratorService],
  exports: [PdfCalendarGeneratorService],
})
export class PdfCalendarGeneratorModule {}
