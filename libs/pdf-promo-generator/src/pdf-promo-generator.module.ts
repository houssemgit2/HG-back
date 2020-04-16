import { Module } from '@nestjs/common';
import { PdfPromoGeneratorService } from './pdf-promo-generator.service';

@Module({
  providers: [PdfPromoGeneratorService],
  exports: [PdfPromoGeneratorService],
})
export class PdfPromoGeneratorModule {}
