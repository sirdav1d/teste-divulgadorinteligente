export type DivulgadorProductAttributes = {
  title: string;
  image: string | null;
  price_from: string | null;
  price: string | null;
  link: string;
  seller: string;
  highlight: boolean;
  free_shipping: boolean;
  coupon: string | null;
  installment: string | null;
  category: string | null;
};

export type DivulgadorCouponAttributes = {
  seller: string;
  code: string;
  discount: string | null;
  title: string;
  description: string | null;
  featured: boolean;
  discount_type: string;
};

export type DivulgadorEntity<TAttributes> = {
  id: number | string;
  attributes: TAttributes;
};

export type DivulgadorCollectionResponse<TAttributes> = {
  data: Array<DivulgadorEntity<TAttributes>>;
};

export type Product = {
  id: string;
  title: string;
  imageUrl: string | null;
  priceLabel: string | null;
  priceValue: number | null;
  priceFromLabel: string | null;
  link: string;
  seller: string;
  couponCode: string | null;
  installment: string | null;
  highlight: boolean;
  freeShipping: boolean;
  category: string | null;
};

export type Coupon = {
  id: string;
  seller: string;
  code: string;
  title: string;
  description: string | null;
  featured: boolean;
  discountType: string;
  discountValue: number | null;
  discountLabel: string | null;
};
