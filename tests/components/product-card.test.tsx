/* eslint-disable @next/next/no-img-element */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ProductCard from "../../components/catalog/product-card";
import type { Product } from "../../lib/types/divulgador";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

const baseProduct: Product = {
  id: "1",
  title: "Analog headphone stand",
  imageUrl: "https://m.media-amazon.com/images/I/stand.jpg",
  priceLabel: "R$ 199,90",
  priceValue: 199.9,
  priceFromLabel: null,
  link: "https://example.com",
  seller: "amazon",
  couponCode: null,
  installment: null,
  highlight: false,
  freeShipping: false,
  category: "audio",
};

describe("ProductCard", () => {
  it("renders the seller and current price", () => {
    const html = renderToStaticMarkup(<ProductCard product={baseProduct} />);

    expect(html).toContain("Amazon");
    expect(html).toContain("R$ 199,90");
  });

  it("renders the subdued record action label", () => {
    const html = renderToStaticMarkup(<ProductCard product={baseProduct} />);

    expect(html).toContain("Open item record");
  });

  it("renders the fallback copy when the image is missing", () => {
    const html = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, imageUrl: null }} />,
    );

    expect(html).toContain("Image unavailable");
  });
});
