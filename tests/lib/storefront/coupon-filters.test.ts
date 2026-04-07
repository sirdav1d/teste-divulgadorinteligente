import { describe, expect, it } from "vitest";

import {
  ALL_COUPON_VALUE,
  buildCouponOptions,
} from "../../../lib/storefront/coupon-filters";
import type { Coupon } from "../../../lib/types/divulgador";

const coupons: Coupon[] = [
  {
    id: "1",
    seller: "amazon",
    code: "SEUCUPOM",
    title: "Cupom Amazon",
    description: "Economize na vitrine",
    featured: false,
    discountType: "percent",
    discountValue: 10,
    discountLabel: "10%",
  },
  {
    id: "2",
    seller: "mercadolivre",
    code: "AGORAVAI",
    title: "Cupom Mercado Livre",
    description: "Economize ainda mais",
    featured: false,
    discountType: "percent",
    discountValue: 15,
    discountLabel: "15%",
  },
];

describe("coupon filters", () => {
  it("prepends an all-coupons option and preserves coupon metadata", () => {
    const options = buildCouponOptions(coupons);

    expect(options[0]).toMatchObject({
      value: ALL_COUPON_VALUE,
      label: "Todos os cupons",
    });

    expect(options).toContainEqual(
      expect.objectContaining({
        value: "SEUCUPOM",
        label: "SEUCUPOM",
      }),
    );
  });
});
