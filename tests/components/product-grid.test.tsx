import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductGrid from "../../components/catalog/product-grid";
import type { Product } from "../../lib/types/divulgador";

function createProduct(index: number): Product {
  return {
    id: `${index}`,
    title: `Produto ${index}`,
    imageUrl: "https://example.com/product.jpg",
    priceLabel: "R$ 199,90",
    priceValue: 199.9,
    priceFromLabel: null,
    link: `https://example.com/products/${index}`,
    seller: "amazon",
    couponCode: null,
    installment: null,
    highlight: false,
    freeShipping: false,
    category: "beauty",
  };
}

describe("ProductGrid", () => {
  it("shows a load-more action when more than 12 products are available", () => {
    const products = Array.from({ length: 12 }, (_, index) =>
      createProduct(index + 1),
    );
    const html = renderToStaticMarkup(
      <ProductGrid
        {...({
          onAddToCart: () => {},
          products,
          totalCount: 13,
          onLoadMore: () => {},
        } as never)}
      />,
    );

    expect(html).toContain("Ver mais");
    expect(html).toContain("bg-brand-primary-strong");
    expect(html).toContain("text-surface");
  });
});
