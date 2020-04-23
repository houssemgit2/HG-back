import { PROMO_TYPES } from '../consts';
import { RemEurProduct } from './rem-eur-product';
import { RemEurGamme } from './rem-eur-gamme';
import { DecreasingPrices } from './decreasing-prices';
import { RemPurcProduct } from '@app/pdf-promo-generator/promos/rem-purc-product';
import { RemPurcGamme } from '@app/pdf-promo-generator/promos/rem-purc-gamme';
import { RemPurcSecondProduct } from '@app/pdf-promo-generator/promos/rem-purc-second-product';
import { FreeSecondProduct } from '@app/pdf-promo-generator/promos/free-second-product';
import { RemPurcSecondProdDiff } from '@app/pdf-promo-generator/promos/rem-purc-second-prod-diff';
import { ThirdProdFree } from '@app/pdf-promo-generator/promos/third-prod-free';
import { SecProdDiffFree } from '@app/pdf-promo-generator/promos/sec-prod-diff-free';
import { RemGlobal } from '@app/pdf-promo-generator/promos/rem-global';
import { NewPriceFix } from '@app/pdf-promo-generator/promos/new-price-fix';
import { NewPriceFixDecimal } from '@app/pdf-promo-generator/promos/new-price-fix-decimal';
import { RemPurcSecondGamme } from '@app/pdf-promo-generator/promos/rem-purc-second-gamme';

export function PDFPromoTemplateFiller(
  promo,
  desiredOrientation,
  templateOrientation,
) {
  let filler;
  switch (promo.type) {
    case PROMO_TYPES.PRICE_DISCOUNT_EUR_PRODUCT:
      filler = new RemEurProduct(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_EUR_RANGE:
      filler = new RemEurGamme(promo);
      break;
    case PROMO_TYPES.LOT_BASED_PRICING:
      filler = new DecreasingPrices(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_PRODUCT:
      filler = new RemPurcProduct(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_RANGE:
      filler = new RemPurcGamme(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_SECOND_PRODUCT:
      filler = new RemPurcSecondProduct(promo);
      break;
    case PROMO_TYPES.SECOND_PRODUCT_OFFERED:
      filler = new FreeSecondProduct(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_SECOND_DIFFERENT_PRODUCT:
      filler = new RemPurcSecondProdDiff(promo);
      break;
    case PROMO_TYPES.THIRD_PRODUCT_OFFERED:
      filler = new ThirdProdFree(promo);
      break;
    case PROMO_TYPES.SECOND_DIFFERENT_PRODUCT_OFFRED:
      filler = new SecProdDiffFree(promo);
      break;
    case PROMO_TYPES.GLOBAL_DISCOUNT:
      filler = new RemGlobal(promo);
      break;
    case PROMO_TYPES.FIXED_PRICE:
      if (parseInt(promo.prmDet.discount, 10) === promo.prmDet.discount) {
        filler = new NewPriceFix(promo);
      } else filler = new NewPriceFixDecimal(promo);
      break;
    case PROMO_TYPES.PRICE_DISCOUNT_PER_SECOND_GAMME:
      filler = new RemPurcSecondGamme(promo);
      break;
    case PROMO_TYPES.FALLING_PRICE:
      filler = new DecreasingPrices(promo);
      break;
    default:
      console.log(
        `templates:index.js  promo type ${promo.type} is not recognized`,
      );
      throw new Error(`promo type ${promo.type} is not recognized`);
  }
  return filler.generate(templateOrientation, desiredOrientation);
}
