import { cacheLife, cacheTag } from "next/cache";

import {
  normalizeCoupon,
  normalizeProduct,
} from "./normalizers";
import type {
  Coupon,
  DivulgadorCollectionResponse,
  DivulgadorCouponAttributes,
  DivulgadorProductAttributes,
  Product,
} from "../types/divulgador";

const API_BASE_URL = "https://api.divulgadorinteligente.com/api";
const SITE_NAME = "espionandopromos";

function buildUrl(pathname: string, searchParams: URLSearchParams) {
  return `${API_BASE_URL}${pathname}?${searchParams.toString()}`;
}

async function fetchCollection<TAttributes>(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Divulgador API request failed with status ${response.status}`);
  }

  return (await response.json()) as DivulgadorCollectionResponse<TAttributes>;
}

export async function getProducts() {
  "use cache";

  cacheLife("minutes");
  cacheTag("products");

  const searchParams = new URLSearchParams({
    sitename: SITE_NAME,
    start: "0",
    limit: "20",
  });

  const payload = await fetchCollection<DivulgadorProductAttributes>(
    buildUrl("/products", searchParams),
  );

  return payload.data.map(normalizeProduct);
}

export async function getCoupons() {
  "use cache";

  cacheLife("minutes");
  cacheTag("coupons");

  const searchParams = new URLSearchParams({
    sitename: SITE_NAME,
    start: "0",
    limit: "10",
    featured: "false",
  });

  const payload = await fetchCollection<DivulgadorCouponAttributes>(
    buildUrl("/coupons/public", searchParams),
  );

  return payload.data.map(normalizeCoupon);
}

type GetProductsByCouponOptions = {
  coupon: string;
  seller?: string;
};

export async function getProductsByCoupon({
  coupon,
  seller,
}: GetProductsByCouponOptions) {
  "use cache";

  cacheLife("minutes");
  cacheTag("products");

  const searchParams = new URLSearchParams({
    sitename: SITE_NAME,
    start: "0",
    limit: "20",
    coupon,
  });

  if (seller) {
    searchParams.append("sellers[]", seller);
  }

  const payload = await fetchCollection<DivulgadorProductAttributes>(
    buildUrl("/products", searchParams),
  );

  return payload.data.map(normalizeProduct);
}

export type { Coupon, Product };
