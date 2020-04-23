import * as moment from 'moment';
import * as fs from 'fs';
import { calcEcoPerUnit, contenancePerMes, extractDecimals } from '../helpers';
import * as Handlebars from 'handlebars';
import { ORIENTATIONS } from '../consts';
export class RemEurGamme {
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
      newPrice: promo.prmDet.newPrice,
    };
  }
  generate(templateOrientation, desiredOrientation) {
    const priceDecimalTemplate = fs.readFileSync(
      `${__dirname}/resources/views/price-round/price-round.hbs`,
      'utf-8',
    );
    const style = fs.readFileSync(
      `${__dirname}/resources/views/style.css`,
      'utf-8',
    );

    const compiled = Handlebars.compile(priceDecimalTemplate);
    const promoData = {
      color1: this.PDFPromo.monge ? 'yellow-fill' : 'white-fill',
      color2: this.PDFPromo.monge ? 'red-fill' : 'black-fill',
      crossColor: this.PDFPromo.monge ? 'red-stroke' : 'black-stroke',
      lab: this.PDFPromo.lab,
      libelle: this.PDFPromo.libelle,
      discount: this.PDFPromo.newPrice,
      mention2: this.PDFPromo.mention2,
      mention: this.PDFPromo.mention,
      startDate: this.PDFPromo.startDate,
      endDate: this.PDFPromo.endDate,
      textBelowDiscount: 'DE REMISE',
    };

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
        `${__dirname}/resources/views/price-round/landscape/body-circle.hbs`,
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

      Handlebars.registerPartial('newPrice_landscape', newPrice_landscape);
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
        `${__dirname}/resources/views/price-round/portrait/body-circle.hbs`,
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
      };
      template = compiled(context).toString();
    }
    return template;
  }
}
