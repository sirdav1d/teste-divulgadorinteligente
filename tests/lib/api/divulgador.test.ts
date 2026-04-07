import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

import {
  getCoupons,
  getProducts,
  getProductsByCoupon,
} from "../../../lib/api/divulgador";
import {
  normalizeCoupon,
  normalizeProduct,
} from "../../../lib/api/normalizers";
import { parseCurrencyValue } from "../../../lib/utils/currency";

const productFixture = {
  id: 37091563,
  attributes: {
    title: "Panela Elétrica Electrolux vapor arroz capacidade 1,8L 10 xícaras",
    image: "https://m.media-amazon.com/images/I/515wvq9UoKL._SS500__QL100_.jpg",
    price_from: null,
    price: "R$\u00a0269,82",
    link: "https://amzn.to/4bUfKQm",
    seller: "amazon",
    highlight: false,
    free_shipping: false,
    coupon: "SEUCUPOM",
    installment: "ou 6x de R$\u00a045,00",
    category: "kitchen",
  },
};

const couponFixture = {
  id: 955361,
  attributes: {
    seller: "amazon",
    code: "SEUCUPOM",
    discount: "10",
    title: "Cupom Amazon",
    description: "Desconto exclusivo: ative seu cupom e aproveite a oferta!",
    featured: false,
    discount_type: "percent",
  },
};

describe("divulgador data layer", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("parses Brazilian currency strings into numeric values", () => {
    expect(parseCurrencyValue("R$\u00a0269,82")).toBe(269.82);
    expect(parseCurrencyValue("R$ 199,99")).toBe(199.99);
    expect(parseCurrencyValue(null)).toBeNull();
  });

  it("normalizes raw product payloads into a serializable storefront shape", () => {
    expect(normalizeProduct(productFixture)).toEqual({
      id: "37091563",
      title: "Panela Elétrica Electrolux vapor arroz capacidade 1,8L 10 xícaras",
      imageUrl:
        "https://m.media-amazon.com/images/I/515wvq9UoKL._SS500__QL100_.jpg",
      priceLabel: "R$\u00a0269,82",
      priceValue: 269.82,
      priceFromLabel: null,
      link: "https://amzn.to/4bUfKQm",
      seller: "amazon",
      couponCode: "SEUCUPOM",
      installment: "ou 6x de R$\u00a045,00",
      highlight: false,
      freeShipping: false,
      category: "kitchen",
    });
  });

  it("normalizes raw coupon payloads into a serializable coupon shape", () => {
    expect(normalizeCoupon(couponFixture)).toEqual({
      id: "955361",
      seller: "amazon",
      code: "SEUCUPOM",
      title: "Cupom Amazon",
      description: "Desconto exclusivo: ative seu cupom e aproveite a oferta!",
      featured: false,
      discountType: "percent",
      discountValue: 10,
      discountLabel: "10%",
    });
  });

  it("fetches and normalizes products by coupon with the expected query params", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [productFixture] }),
    });

    const products = await getProductsByCoupon({
      coupon: "AGORAVAI",
      seller: "magalu",
    });

    expect(products).toHaveLength(1);
    expect(products[0].couponCode).toBe("SEUCUPOM");

    const [requestUrl] = fetchMock.mock.calls[0] as [string];
    const url = new URL(requestUrl);

    expect(url.pathname).toBe("/api/products");
    expect(url.searchParams.get("coupon")).toBe("AGORAVAI");
    expect(url.searchParams.get("sitename")).toBe("espionandopromos");
    expect(url.searchParams.get("limit")).toBe("20");
    expect(url.searchParams.getAll("sellers[]")).toEqual(["magalu"]);
  });

  it("fetches products and coupons from the public endpoints", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [productFixture] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [couponFixture] }),
      });

    const [products, coupons] = await Promise.all([getProducts(), getCoupons()]);

    expect(products[0].title).toContain("Panela Elétrica");
    expect(coupons[0].code).toBe("SEUCUPOM");
  });
});
