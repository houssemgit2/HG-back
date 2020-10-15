import { IEqualCondition } from './mea.interface';
export type IEligibilityCaDetails = IEqualCondition[];

export interface IEligibilityVolume {
  value_min: number;
  value_max: number;
}

export interface IEligibilityFranco {
  value: number;
  eligibility_franco_type_id: number;
}

export interface IAchatAdvantageDiscountDetails {
  achat_advantage_discount_type_id: number; // (Euros | Pourcentage | Unité Gratuite)
  data:
    | IEuroAdvantageDiscount
    | IPerCentAdvantageDiscount[]
    | IFreeUnitAdvantageDiscount;
}
export interface IEuroAdvantageDiscount {
  achat_advantage_sub_discount_type_id: number;
  value: number;
}
export interface IPerCentAdvantageDiscount {
  unity: boolean;
  discount: boolean;
  achat_advantage_sub_discount_type_id: number;
  variegated: boolean | null;
  comment: string;
}
export interface IFreeUnitAdvantageDiscount {
  ordered_unity: number;
  free_unity: number;
  comment: string;
}
