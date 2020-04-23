import * as moment from 'moment';
import * as fs from 'fs';
import {
  calcEcoPerUnit,
  contenancePerMes,
  extractDecimals,
  transformDeterminant,
  wordWrap,
} from '../helpers';
import * as Handlebars from 'handlebars';
import { ORIENTATIONS } from '../consts';
export class RemPurcSecondProdDiff {
  PDFPromo;
  constructor(promo) {
    this.PDFPromo = {
      monge: promo.monge || false,
      format: promo.format,
      copies: promo.copies,
      discount: promo.prmDet.discount,
      orientation: promo.orientation,
      startDate: moment(promo.prmStartDate, 'DD-MM-YYYY').format('Do MMMM'),
      endDate: moment(promo.prmEndDate, 'DD-MM-YYYY').format('Do MMMM'),
      mention: promo.prmMention || '',
      mention2: promo.prmDet.prmMention2 || '',
      lab: promo.prmDet.lab.toUpperCase(),
      libelle: promo.prmDet.libelle.toUpperCase(),
      firstProductDet: promo.prmDet.firstProductDet || 1,
      firstProduct: promo.prmDet.firstProduct.toUpperCase(),
      secondProduct: promo.prmDet.secondProduct.toUpperCase(),
      secondProductDet: promo.prmDet.secondProductDet || 1,
      oldPriceDecimal: extractDecimals(promo.prmDet.oldPrice),
      oldPriceDigits: Math.floor(promo.prmDet.oldPrice),
    };
  }
  generate(templateOrientation, desiredOrientation) {
    const discountPerTemplate = fs.readFileSync(
      `${__dirname}/views/discount-per/discount-per.hbs`,
      'utf-8',
    );
    const style = fs.readFileSync(`${__dirname}/views/style.css`, 'utf-8');

    const compiled = Handlebars.compile(discountPerTemplate);
    const textBelowDiscount = wordWrap(
      `${this.PDFPromo.secondProductDet} ${this.PDFPromo.secondProduct} ${this.PDFPromo.libelle}`,
      12,
    );
    const promoData = {
      color1: this.PDFPromo.monge ? 'yellow-fill' : 'white-fill',
      color2: this.PDFPromo.monge ? 'red-fill' : 'black-fill',
      crossColor: this.PDFPromo.monge ? 'red-stroke' : 'black-stroke',
      lab: this.PDFPromo.lab,
      libelle: this.PDFPromo.libelle,
      firstProductDet: this.PDFPromo.firstProductDet,
      firstProduct: this.PDFPromo.firstProduct,
      discount: this.PDFPromo.discount,
      mention2: this.PDFPromo.mention2,
      mention: this.PDFPromo.mention,
      startDate: this.PDFPromo.startDate,
      endDate: this.PDFPromo.endDate,
      oldPriceDigits: this.PDFPromo.oldPriceDigits,
      oldPriceDecimal: this.PDFPromo.oldPriceDecimal,
      textBelowOldPrice: `${transformDeterminant(
        this.PDFPromo.firstProductDet,
      )} ${this.PDFPromo.firstProduct}`,
      textBelowDiscount: textBelowDiscount[0],
      textBelowDiscount2: textBelowDiscount[1],
      crossed: true,
    };
    const OP_Translate = this.PDFPromo.oldPriceDigits >= 10 ? 0 : -30;
    const NP_Translate = this.PDFPromo.newPriceDigits >= 10 ? 0 : -30;
    let template = '';
    if (templateOrientation === ORIENTATIONS.LANDSCAPE) {
      const landscape_header = fs.readFileSync(
        `${__dirname}/views/landscape/header.hbs`,
        'utf-8',
      );
      const landscape_footer = fs.readFileSync(
        `${__dirname}/views/landscape/footer.hbs`,
        'utf-8',
      );
      const landscape_bodyCircle = fs.readFileSync(
        `${__dirname}/views/discount-per/landscape/body-circle.hbs`,
        'utf-8',
      );
      const oldPrice_landscape = fs.readFileSync(
        `${__dirname}/views/landscape/old-price.hbs`,
        'utf-8',
      );

      Handlebars.registerPartial('oldPrice_landscape', oldPrice_landscape);
      Handlebars.registerPartial('landscape_header', landscape_header);
      Handlebars.registerPartial('landscape_bodyCircle', landscape_bodyCircle);
      Handlebars.registerPartial('landscape_footer', landscape_footer);
      const context = {
        ...promoData,
        style,
        landscape: true,
        viewBox:
          desiredOrientation === ORIENTATIONS.LANDSCAPE
            ? '0 0 842.24 596'
            : '0 0 596 842.24',
        transform:
          desiredOrientation === ORIENTATIONS.LANDSCAPE
            ? ''
            : 'translate(120.5,123.857041) rotate(-90,298,420)',
        NP_Translate,
        OP_Translate,
      };
      template = compiled(context).toString();
    } else if (templateOrientation === ORIENTATIONS.PORTRAIT) {
      const portrait_header = fs.readFileSync(
        `${__dirname}/views/portrait/header.hbs`,
        'utf-8',
      );
      const portrait_footer = fs.readFileSync(
        `${__dirname}/views/portrait/footer.hbs`,
        'utf-8',
      );
      const portrait_bodyCircle = fs.readFileSync(
        `${__dirname}/views/discount-per/portrait/body-circle.hbs`,
        'utf-8',
      );
      const oldPrice_portrait = fs.readFileSync(
        `${__dirname}/views/portrait/old-price.hbs`,
        'utf-8',
      );

      Handlebars.registerPartial('oldPrice_portrait', oldPrice_portrait);
      Handlebars.registerPartial('portrait_header', portrait_header);
      Handlebars.registerPartial('portrait_bodyCircle', portrait_bodyCircle);
      Handlebars.registerPartial('portrait_footer', portrait_footer);
      const context = {
        ...promoData,
        style,
        portrait: true,
        width:
          desiredOrientation === ORIENTATIONS.PORTRAIT
            ? '157.76576mm'
            : '223.01465mm',
        height:
          desiredOrientation === ORIENTATIONS.PORTRAIT
            ? '223.01465mm'
            : '157.76576mm',
        viewBox:
          desiredOrientation === ORIENTATIONS.PORTRAIT
            ? '0 0 157.76577 223.01465'
            : '0 0 223.01465 157.76577',
        transform:
          desiredOrientation === ORIENTATIONS.PORTRAIT
            ? 'translate(12.3,-54.557041) matrix(0.26458333,0,0,0.26458333,-12.392896,54.868451)'
            : 'translate(-25,-44.857041) rotate(-90,80,110) matrix(0.26458333,0,0,0.26458333,-12.392896,54.868451)',
        NP_Translate,
        OP_Translate,
      };
      template = compiled(context).toString();
    }
    return template;
  }
}
