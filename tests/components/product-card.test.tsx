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

  it("keeps the product card image-led and removes noisy badges", () => {
    const html = renderToStaticMarkup(
      <ProductCard
        product={{ ...baseProduct, highlight: true, freeShipping: true }}
      />,
    );

    expect(html).toContain("Ver oferta");
    expect(html).toContain("bg-brand-primary-strong");
    expect(html).toContain("text-surface");
    expect(html).not.toContain("Record 1");
    expect(html).not.toContain("Destaque");
    expect(html).not.toContain("Frete gratis");
  });

  it("renders the fallback copy when the image is missing", () => {
    const html = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, imageUrl: null }} />,
    );

    expect(html).toContain("Imagem indisponivel");
  });

  it("labels uncategorized products as Outros", () => {
    const html = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, category: null }} />,
    );

    expect(html).toContain("Outros");
  });
});
