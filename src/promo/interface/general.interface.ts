export interface IGeneralParams {
  start_date: string;
  end_date: string;
  laboratory_id: number;
  clusters_id: number[];
  comment: string;
}
export interface IUnitCapacity {
  value: number;
  unity: string;
  lot: boolean;
}
export interface IProducts {
  all: boolean;
  products_in: number[] | null;
  products_out: number[] | null;
}
export interface IConcerned {
  gamme: boolean;
  product: boolean;
  gamme_id: number;
  products: IProducts | null;
}
export interface IConcernedProduct extends IConcerned {
  ean: number;
  product_id: number;
}
