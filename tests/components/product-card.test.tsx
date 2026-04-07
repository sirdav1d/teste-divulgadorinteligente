import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductCard from "../../components/catalog/product-card";
import type { Product } from "../../lib/types/divulgador";

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
    expect(html).not.toContain("Oferta sem cupom destacado");
  });

  it("uses the cart CTA instead of the external offer link CTA", () => {
    const html = renderToStaticMarkup(
      <ProductCard
        product={{ ...baseProduct, highlight: true, freeShipping: true }}
      />,
    );

    expect(html).toContain("Adicionar ao carrinho");
    expect(html).not.toContain("Ver oferta");
    expect(html).toContain("bg-brand-primary-strong");
    expect(html).toContain("text-surface");
    expect(html).not.toContain("Record 1");
    expect(html).not.toContain("Destaque");
    expect(html).not.toContain("Frete grátis");
  });

  it("removes the external anchor behavior from the card", () => {
    const html = renderToStaticMarkup(<ProductCard product={baseProduct} />);

    expect(html).not.toContain(`href="${baseProduct.link}"`);
    expect(html).not.toContain('target="_blank"');
  });

  it("renders the fallback copy when the image is missing", () => {
    const html = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, imageUrl: null }} />,
    );

    expect(html).toContain("Imagem indisponível");
  });

  it("labels uncategorized products as Outros", () => {
    const html = renderToStaticMarkup(
      <ProductCard product={{ ...baseProduct, category: null }} />,
    );

    expect(html).toContain("Outros");
  });
});
