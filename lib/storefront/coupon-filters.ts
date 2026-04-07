import type { Coupon } from "../types/divulgador";

export const ALL_COUPON_VALUE = "all-coupons";

export type CouponOption = {
  value: string;
  label: string;
  description: string;
  keywords: string[];
};

const SELLER_LABELS: Record<string, string> = {
  amazon: "Amazon",
  mercadolivre: "Mercado Livre",
  magalu: "Magazine Luiza",
  shopee: "Shopee",
  natura: "Natura",
};

function getSellerLabel(seller: string) {
  return SELLER_LABELS[seller] ?? seller;
}

export function buildCouponOptions(coupons: readonly Coupon[]): CouponOption[] {
  const seen = new Set<string>();
  const options: CouponOption[] = [
    {
      value: ALL_COUPON_VALUE,
      label: "Todos os cupons",
      description: "Exibe toda a vitrine sem filtrar por cupom.",
      keywords: ["todos", "cupons", "vitrine"],
    },
  ];

  for (const coupon of coupons.toSorted((left, right) =>
    left.code.localeCompare(right.code, "pt-BR"),
  )) {
    if (seen.has(coupon.code)) {
      continue;
    }

    seen.add(coupon.code);

    const sellerLabel = getSellerLabel(coupon.seller);
    const descriptionParts = [coupon.title, sellerLabel, coupon.discountLabel]
      .filter(Boolean)
      .join(" - ");

    options.push({
      value: coupon.code,
      label: coupon.code,
      description:
        descriptionParts || "Cupom disponível para filtrar as ofertas.",
      keywords: [coupon.code, coupon.title, sellerLabel].filter(Boolean),
    });
  }

  return options;
}
