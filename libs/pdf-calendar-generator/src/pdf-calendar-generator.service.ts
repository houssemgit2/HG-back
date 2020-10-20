import { serializePromosValues } from '@app/pdf-calendar-generator/utils';

import { Injectable, Logger } from '@nestjs/common';

import * as fs from 'fs';

import { v1 as uuidv1 } from 'uuid';
import { sortByLaboAndPromoType } from './utils';
import * as XLSX from 'xlsx';

import PdfPrinter = require('pdfmake');
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
  logger = new Logger('Pdf Calendar Generator Service');
  generate(promos, typeOff) {
    const printer = new PdfPrinter(availableFonts);
    this.logger.debug(`genrete pdf ${typeOff} promo`);
    const template: any = {
      content: [
        { text: 'Promos calendar', style: 'header' },
        {
          style: 'table',
          table: {
            body: serializePromosValues(promos, typeOff),
          },
        },
      ],
      pageSize:
        typeOff && typeOff.toLowerCase().indexOf('mea') !== -1 ? 'A1' : 'A2',
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
  generateCsvCalendar(promos, typeOff, bookType) {
    const serializePromos = serializePromosValues(promos, typeOff);
    const header = serializePromos[0].map(item => item.text);
    const workBook = XLSX.utils.book_new();
    const sortedArray = this.arrayToJsonArray(serializePromos);
    const workSheet = XLSX.utils.json_to_sheet(sortedArray, {
      header,
    });
    workSheet['!margins'] = {
      left: 1.0,
      right: 1.0,
      top: 1.0,
      bottom: 1.0,
      header: 0.5,
      footer: 0.5,
    };
    const wsName = `${Date.now()}`;
    const filePath = `${__dirname}/../output/exportedExcel/${wsName}.${bookType}`;

    XLSX.utils.book_append_sheet(workBook, workSheet, wsName);

    XLSX.writeFile(workBook, filePath, {
      bookType,
    });
    return filePath;
  }
  arrayToJsonArray(serializePromos) {
    console.log('-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*');
    console.log(serializePromos);
    const header = serializePromos[0].map(item => item.text);
    serializePromos.shift();
    const promosObjects = this.arrrOfArrToJsonArr(serializePromos, header);
    console.log('promosObjects');
    console.log(promosObjects);
    return sortByLaboAndPromoType(
      promosObjects,
      header[2],
      header[1],
      header[0],
    );
  } // tofix has to be in a util.js or helpers
  arrrOfArrToJsonArr(arrayOfArray, objectKeysArray) {
    return arrayOfArray.map(item => {
      const promoObj = {};
      item.map((currentValue, index) => {
        promoObj[objectKeysArray[index]] = currentValue;
        return true;
      });
      return promoObj;
    });
  }
}
