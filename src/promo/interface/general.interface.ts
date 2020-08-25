export interface GeneralParams {
  start_date: string;
  end_date: string;
  laboratory_id: number;
  clusters_id: number[];
  comment: string;
}
export interface UnitCapacity {
  value: number;
  unity: string;
  lot: boolean;
}
export interface Products {
  all: boolean;
  products_in: number[] | null;
  products_out: number[] | null;
}
export interface Concerned {
  gamme: boolean;
  product: boolean;
  gamme_id: number;
  products: Products | null;
}
export interface ConcernedProduct extends Concerned {
  ean: number;
  product_id: number;
}
