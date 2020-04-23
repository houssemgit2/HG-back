import * as moment from 'moment';
import * as fs from 'fs';
import { calcEcoPerUnit, contenancePerMes, extractDecimals } from '../helpers';
import * as Handlebars from 'handlebars';
import { ORIENTATIONS } from '../consts';

export class FreeSecondProduct {
  PDFPromo;
  constructor(promo) {
    const newPrice = (promo.prmDet.oldPrice * 0.5).toFixed(2);
    this.PDFPromo = {
      monge: promo.monge || false,
      format: promo.format,
      copies: promo.copies,
      orientation: promo.orientation,
      startDate: moment(promo.prmStartDate, 'DD-MM-YYYY').format('Do MMMM'),
      endDate: moment(promo.prmEndDate, 'DD-MM-YYYY').format('Do MMMM'),
      mention: promo.prmMention || '',
      mention2: promo.prmDet.prmMention2 || '',
      lab: promo.prmDet.lab.toUpperCase(),
      libelle: promo.prmDet.libelle.toUpperCase(),
      contPerMes: contenancePerMes(
        promo.prmDet.contenance,
        promo.prmDet.mesUnit,
        promo.prmDet.physicalLot,
      ),
      oldPriceDecimal: extractDecimals(promo.prmDet.oldPrice),
      oldPriceDigits: Math.floor(promo.prmDet.oldPrice),
      newPrice,
      newPricePerUnit: calcEcoPerUnit(
        newPrice,
        promo.prmDet.contenance,
        promo.prmDet.mesUnit,
        promo.prmDet.physicalLot,
      ),
      oldPricePerUnit: calcEcoPerUnit(
        promo.prmDet.oldPrice,
        promo.prmDet.contenance,
        promo.prmDet.mesUnit,
        promo.prmDet.physicalLot,
      ),
    };
  }
  generate(templateOrientation, desiredOrientation) {
    const ProductOfferedTemplate = fs.readFileSync(
      `${__dirname}/resources/views/prod-offered/product-offered.hbs`,
      'utf-8',
    );
    const style = fs.readFileSync(
      `${__dirname}/resources/views/style.css`,
      'utf-8',
    );

    const compiled = Handlebars.compile(ProductOfferedTemplate);
    const promoData = {
      color1: this.PDFPromo.monge ? 'yellow-fill' : 'white-fill',
      color2: this.PDFPromo.monge ? 'red-fill' : 'black-fill',
      crossColor: this.PDFPromo.monge ? 'red-stroke' : 'black-stroke',
      contPerMes: this.PDFPromo.contPerMes,
      lab: this.PDFPromo.lab,
      libelle: this.PDFPromo.libelle,
      mention2: this.PDFPromo.mention2,
      mention: this.PDFPromo.mention,
      newPrice: this.PDFPromo.newPrice,
      priceUnityDescription: this.PDFPromo.newPricePerUnit
        ? `${this.PDFPromo.newPricePerUnit} au lieu de ${this.PDFPromo.oldPricePerUnit}`
        : '',
      startDate: this.PDFPromo.startDate,
      endDate: this.PDFPromo.endDate,
      oldPriceDigits: this.PDFPromo.oldPriceDigits,
      oldPriceDecimal: this.PDFPromo.oldPriceDecimal,
      newPriceDigits: this.PDFPromo.oldPriceDigits,
      newPriceDecimal: this.PDFPromo.oldPriceDecimal,
      quantity: 1,
      bought: 'ACHETÉ',
      textBelowNewPrice: 'LES 2',
      textBelowOldPrice: 'L’UNITÉ',
      crossed: true,
    };
    const OP_Translate = this.PDFPromo.oldPriceDigits >= 10 ? 10 : -10;
    const NP_Translate = this.PDFPromo.oldPriceDigits >= 10 ? 0 : -30;
    let template = '';
    if (templateOrientation === ORIENTATIONS.LANDSCAPE) {
      const landscape_header = fs.readFileSync(
        `${__dirname}/resources/views/landscape/header.hbs`,
        'utf-8',
      );
      const landscape_footer = fs.readFileSync(
        `${__dirname}/resources/views/landscape/footer.hbs`,
        'utf-8',
      );
      const landscape_bodyCircle = fs.readFileSync(
        `${__dirname}/resources/views/prod-offered/landscape/body-circle.hbs`,
        'utf-8',
      );
      const oldPrice_landscape = fs.readFileSync(
        `${__dirname}/resources/views/landscape/old-price.hbs`,
        'utf-8',
      );
      const newPrice_landscape = fs.readFileSync(
        `${__dirname}/resources/views/landscape/new-price.hbs`,
        'utf-8',
      );

      Handlebars.registerPartial('oldPrice_landscape', oldPrice_landscape);
      Handlebars.registerPartial('newPrice_landscape', newPrice_landscape);
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
        `${__dirname}/resources/views/portrait/header.hbs`,
        'utf-8',
      );
      const portrait_footer = fs.readFileSync(
        `${__dirname}/resources/views/portrait/footer.hbs`,
        'utf-8',
      );
      const portrait_bodyCircle = fs.readFileSync(
        `${__dirname}/resources/views/prod-offered/portrait/body-circle.hbs`,
        'utf-8',
      );
      const oldPrice_portrait = fs.readFileSync(
        `${__dirname}/resources/views/portrait/old-price.hbs`,
        'utf-8',
      );
      const newPrice_portrait = fs.readFileSync(
        `${__dirname}/resources/views/portrait/new-price.hbs`,
        'utf-8',
      );

      Handlebars.registerPartial('oldPrice_portrait', oldPrice_portrait);
      Handlebars.registerPartial('newPrice_portrait', newPrice_portrait);
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
