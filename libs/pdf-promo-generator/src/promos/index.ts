import { PROMO_TYPES } from '../consts';
import { RemEurProduct } from './rem-eur-product';

export default function PDFPromoTemplateFiller(
  promo,
  desiredOrientation,
  templateOrientation,
) {
  let filler;
  switch (promo.type) {
    case PROMO_TYPES.PRICE_DISCOUNT_EUR_PRODUCT:
      filler = new RemEurProduct(promo);
      break;
    /*case PROMO_TYPES.PRICE_DISCOUNT_PER_PRODUCT:
      filler = new PriceDiscountPerProd(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_EUR_RANGE:
      filler = new PriceDiscountEurRange(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_RANGE:
      filler = new PriceDiscountPerRange(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_SECOND_PRODUCT:
      filler = new DiscountPerSecondProd(promo);
      break;
    case PROMO_TYPES.SECOND_PRODUCT_OFFERED:
      filler = new SecondProductOffered(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_SECOND_DIFFERENT_PRODUCT:
      filler = new DiscountPerSecondProdDiff(promo);
      break;
    case PROMO_TYPES.THIRD_PRODUCT_OFFERED:
      filler = new ThirdProductOffered(promo);
      break;
    case PROMO_TYPES.SECOND_DIFFERENT_PRODUCT_OFFRED:
      filler = new SecondProductDifferrentOffered(promo);
      break;
    case PROMO_TYPES.GLOBAL_DISCOUNT:
      filler = new GlobalDiscount(promo);
      break;
    case PROMO_TYPES.FIXED_PRICE:
      if (parseInt(promo.prmDet.discount, 10) === promo.prmDet.discount) {
        filler = new FixedPrice(promo);
      } else filler = new FixedPriceDecimal(promo);
      break;
    case PROMO_TYPES.LOT_BASED_PRICING:
      filler = new LotBasedPricing(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_SECOND_GAMME:
      filler = new DiscountPerSecondRange(promo);
      break;
    case PROMO_TYPES.FALLING_PRICE:
      filler = new FallingPrice(promo);
      break;*/
    default:
      console.log(
        `templates:index.js  promo type ${promo.type} is not recognized`,
      );
      throw new Error(`promo type ${promo.type} is not recognized`);
  }
  return filler.generate(templateOrientation, desiredOrientation);
}

module.exports = PDFPromoTemplateFiller;
