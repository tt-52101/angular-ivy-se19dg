export interface Sku {
  costPrice: number;
  disFlag: false;
  defaultFlag: false;
  marketPrice: number;
  salesPrice: number;
  specsNames: string;
  stock: any;
}

export interface Spec {
  id: any;
  name: string;
  productId: any;
  sort: number;
  values: SpecValue[];
}

export interface SpecValue{
  id: any;
  sort: number;
  value: string;
}


export interface SpecItemValueModel {
  name?;
  id?;
  checkFlag?;
}
