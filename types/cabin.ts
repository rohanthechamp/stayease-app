// 1. Define data shape
export type SortValue =
  | "all"
  | "name-asc"
  | "name-desc"
  | "regularPrice-asc"
  | "regularPrice-desc"
  | "maxCapacityCabins-asc"
  | "maxCapacityCabins-desc";

export type FilterValue = "all" | "no-discount" | "with-discount";

export type Cabin = {
  id: number;
  maxCapacity: number;
  created_at: Date;
  name: string;
  regularPrice: number;
  discount: number;
  image: string | null|undefined;
  observations?:string;
  user?: number;
  hotel?: number;
};
export type CabinAPI = {
  id: number;
  maxCapacity: number;
  created_at: string;
  name: string;
  regularPrice: string;
  discount: string;
  observations: string;
  image: string | null|undefined;
  user: number;
  hotel?: number;
  
};
