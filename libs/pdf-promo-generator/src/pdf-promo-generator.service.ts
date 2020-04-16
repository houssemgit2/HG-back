import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { v1 as uuidv1 } from 'uuid';
import * as moment from 'moment';
import 'moment/src/locale/fr-fr';
import * as fs from 'fs';
import { ORIENTATIONS, PAGE_FORMATS } from './consts';
import { A4, A5, A6, A7, A8 } from './config';
import { calculateNextPDFPromoIndex, sortPDFPromos } from './helpers';
import { PDFPromo } from '@app/pdf-promo-generator/classes/PDFPromo';
import SVGtoPDF = require('svg-to-pdfkit');
import PDFPromoTemplateFiller from './promos';
@Injectable()
export class PdfPromoGeneratorService {
  constructor() {
    moment.locale('fr-fr');
  }
  generatePDF(PDFPromos) {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      // useCSS: 'true',
    });

    // eslint-disable-next-line no-unused-vars
    const fontsCallback = (family, bold, italic, fontOptions) => {
      const fontsDirPath = `${__dirname}/../../../static/fonts/`;

      const availableFonts = Array.from(
        fs.readdirSync(fontsDirPath).filter(file => /\.ttf$/.test(file)),
      );
      let face = family.replace(/["']/g, '');
      if (bold && italic) face = `${face} Bold Italic`;
      if (bold) face = `${face} Bold`;
      if (italic) face = `${face} Italic`;
      const match = availableFonts.find(fontObj => {
        const re = new RegExp(`${face}.`);
        return re.test(fontObj);
      });
      if (match !== undefined) {
        // eslint-disable-next-line no-undef
        doc.registerFont(face, fontsDirPath + match);
        return face;
      }
      return 'Helvetica';
    };
    const sortedPDFPromos = sortPDFPromos(PDFPromos);

    let PDFPromoCount = 0;
    let pageIndex = 1;
    sortedPDFPromos.forEach(tck => {
      const pdfpromo = new PDFPromo(tck);
      let formatFunction;
      let switchPageThreshold;
      let desiredOrientation;

      switch (pdfpromo.format) {
        case PAGE_FORMATS.A4:
          formatFunction = A4;
          switchPageThreshold = 1;
          desiredOrientation = ORIENTATIONS.PORTRAIT;
          break;
        case PAGE_FORMATS.A5:
          formatFunction = A5;
          switchPageThreshold = 2;
          desiredOrientation = ORIENTATIONS.LANDSCAPE;
          break;
        case PAGE_FORMATS.A6:
          formatFunction = A6;
          switchPageThreshold = 4;
          desiredOrientation = ORIENTATIONS.PORTRAIT;
          break;
        case PAGE_FORMATS.A7:
          formatFunction = A7;
          switchPageThreshold = 8;
          desiredOrientation = ORIENTATIONS.LANDSCAPE;
          break;
        case PAGE_FORMATS.A8:
          formatFunction = A8;
          switchPageThreshold = 16;
          desiredOrientation = ORIENTATIONS.PORTRAIT;
          break;
        default:
          throw new Error(
            'Invalid parameters, you must provide a valid lot format please check the documentation',
          );
      }

      for (
        let copiesCounter = 0;
        copiesCounter < pdfpromo.copies;
        copiesCounter++
      ) {
        try {
          SVGtoPDF(
            doc,
            PDFPromoTemplateFiller(
              pdfpromo,
              desiredOrientation,
              pdfpromo.orientation,
            ),
            formatFunction(pageIndex).x,
            formatFunction(pageIndex).y,
            {
              fontCallback: fontsCallback,
              width: formatFunction(pageIndex).width,
              height: formatFunction(pageIndex).height,
              preserveAspectRatio: 'xMinYMin meet',
            },
          );
        } catch (e) {
          console.log(e);
        }

        pageIndex++;
        if (
          (pageIndex - 1) % switchPageThreshold === 0 &&
          (sortedPDFPromos[PDFPromoCount + 1] ||
            copiesCounter !== pdfpromo.copies - 1)
        ) {
          doc.addPage({
            size: 'A4',
            margin: 0,
          });
          pageIndex = 1;
        }
      }
      pageIndex = calculateNextPDFPromoIndex(
        pdfpromo,
        sortedPDFPromos[PDFPromoCount + 1],
        pageIndex - 1,
      );

      PDFPromoCount++;
    });

    const filePath = `${__dirname}/../../../../output/PDFPromos/${uuidv1()}.pdf`;

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.end();
    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log('finish');
        resolve(filePath);
      });
      stream.on('error', error => {
        reject(error);
      });
    });
  }
}
