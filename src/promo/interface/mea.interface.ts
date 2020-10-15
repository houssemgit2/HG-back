export interface IEligibilityMinimumDetails {
  quantity_min: number;
  comment: string;
}

export interface IEqualCondition {
  equal_condition_type_id: number;
  value_min: number;
  value_max: number;
  comment: string;
}

export interface IRemunerationUnitProductDetail {
  eligibility_ca_range_type_id: number;
  value: number;
}
export interface IEmplacementDetails {
  emplacement_id: number;
  comment: string;
}
export interface IRemunerationFixedDetails {
  has_quantity: boolean;
  data_quantity: IEqualCondition[];
  has_emplacement: boolean;
  data_emplacement: IEmplacementDetails;
}

export interface IRemunerationCaAnnualDetails {
  remuneration_ca_annual_target_type_id: number;
  remuneration_ca_annual_plate_type_id: number;
}
