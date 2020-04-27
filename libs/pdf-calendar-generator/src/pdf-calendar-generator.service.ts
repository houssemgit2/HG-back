import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v1 as uuidv1 } from 'uuid';
import PdfPrinter = require('pdfmake');
import { serializePromosValues } from '@app/pdf-calendar-generator/utils';
const fontsDirPath = `${__dirname}/resources/fonts`;
const availableFonts = {
  SharpGrostek: {
    normal: `${fontsDirPath}/SharpGroteskBook15.ttf`,
    bold: `${fontsDirPath}/SharpGroteskBold15.ttf`,
    bolditalics: `${fontsDirPath}/SharpGroteskBookItalic15.ttf`,
  },
};
@Injectable()
export class PdfCalendarGeneratorService {
  generate(promos, type_off) {
    const printer = new PdfPrinter(availableFonts);
    const template: any = {
      content: [
        { text: 'Promos calendar', style: 'header' },
        {
          style: 'table',
          table: {
            body: serializePromosValues(promos, type_off),
          },
        },
      ],
      pageSize:
        type_off && type_off.toLowerCase().indexOf('mea') !== -1 ? 'A1' : 'A2',
      pageOrientation: 'landscape',
      defaultStyle: {
        font: 'SharpGrostek',
      },
      styles: {
        tableHeader: {
          fontSize: 16,
          bold: true,
          fillColor: 'green',
          color: 'white',
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(template);
    const filePath = `${__dirname}/../output/PDFPromos/${uuidv1()}.pdf`;
    const stream = fs.createWriteStream(filePath);
    pdfDoc.pipe(stream);
    pdfDoc.end();
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
