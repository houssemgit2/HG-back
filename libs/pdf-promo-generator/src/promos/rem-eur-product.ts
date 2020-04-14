import * as moment from 'moment';
import { calcEcoPerUnit, contenancePerMes, extractDecimals } from '../helpers';
export default class RemEurProduct {
  promo;

  constructor(promo) {
    const newPrice = promo.leaflet
      ? promo.prmDet.price
      : promo.prmDet.oldPrice - promo.prmDet.discount;

    this.promo = {
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
      contPerMes: contenancePerMes(
        promo.prmDet.contenance,
        promo.prmDet.mesUnit,
        promo.prmDet.physicalLot,
      ),
      oldPriceDecimal: extractDecimals(promo.prmDet.oldPrice),
      oldPriceDigits: Math.floor(promo.prmDet.oldPrice),
      newPriceDigits: Math.floor(newPrice),
      newPriceDecimal: extractDecimals(newPrice),
      eco: promo.leaflet ? null : promo.prmDet.discount.toFixed(2),
      newPricePerUnit:
        promo.prmDet.oldPrice || promo.leaflet
          ? calcEcoPerUnit(
              newPrice,
              promo.prmDet.contenance,
              promo.prmDet.mesUnit,
              promo.prmDet.physicalLot,
            )
          : null,
      oldPricePerUnit: calcEcoPerUnit(
        promo.prmDet.oldPrice,
        promo.prmDet.contenance,
        promo.prmDet.mesUnit,
        promo.prmDet.physicalLot,
      ),
      translateValue: Math.floor(newPrice) >= 10 ? 0 : 50,
      translatePriceDigits: promo.leaflet ? '602.32' : '552.32',
      translatePriceDecimal: promo.leaflet ? '596.41' : '546.41',
      translateSymbol: promo.leaflet ? '493.54' : '443.54',
      leaflet: promo.leaflet || false,
    };
  }
}
