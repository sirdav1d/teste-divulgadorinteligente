/* eslint-disable @next/next/no-img-element */
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import StorefrontClient from "../../components/storefront/storefront-client";
import type { Product } from "../../lib/types/divulgador";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

const products: Product[] = [
  {
    id: "1",
    title: "Panela Eletrica Electrolux vapor arroz capacidade 1,8L 10 xicaras",
    imageUrl: "https://m.media-amazon.com/images/I/515wvq9UoKL._SS500__QL100_.jpg",
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
  },
  {
    id: "2",
    title: "Kit 2 Macaquinho Curto Fitness Poli Academia",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_2X_837065-MLB90029944053_082025-V-kit-2-macaquinho-curto-fitness-poli-academia.jpeg",
    priceLabel: "R$\u00a076,69",
    priceValue: 76.69,
    priceFromLabel: "R$ 199,99",
    link: "https://meli.la/1bE8Ywd",
    seller: "mercadolivre",
    couponCode: "AGORAVAI",
    installment: "ou 3x de R$\u00a026,91",
    highlight: false,
    freeShipping: false,
    category: null,
  },
  {
    id: "3",
    title: "Mouse Vertical Sem Fio Ergonomico Office Preto",
    imageUrl: "https://m.media-amazon.com/images/I/61mouse.jpg",
    priceLabel: "R$\u00a0129,90",
    priceValue: 129.9,
    priceFromLabel: null,
    link: "https://example.com/mouse",
    seller: "amazon",
    couponCode: null,
    installment: null,
    highlight: true,
    freeShipping: true,
    category: "office",
  },
];

function renderStorefront() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <StorefrontClient
        products={products}
        selectedCoupon={null}
      />,
    );
  });

  return {
    container,
    cleanup() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("StorefrontClient", () => {
  it("renders the premium hero, functional search, and category rail", () => {
    const view = renderStorefront();

    expect(view.container.textContent).toContain(
      "Ofertas em movimento, com acabamento premium.",
    );
    expect(view.container.textContent).toContain("Buscar na vitrine");
    expect(view.container.textContent).toContain("Categorias do momento");
    expect(view.container.textContent).toContain("Selecao aberta");
    expect(view.container.textContent).not.toContain("Catalog for calm review");
    expect(view.container.textContent).toContain("Todos");
    expect(view.container.textContent).toContain("Outros");
    expect(view.container.textContent).toContain("Panela Eletrica Electrolux");
    expect(view.container.textContent).toContain(
      "Kit 2 Macaquinho Curto Fitness Poli Academia",
    );
    expect(view.container.textContent).toContain(
      "Mouse Vertical Sem Fio Ergonomico Office Preto",
    );

    view.cleanup();
  });

  it("filters products by title as the user types", () => {
    const view = renderStorefront();
    const input = view.container.querySelector("input[name='search']");

    expect(input).not.toBeNull();

    act(() => {
      input!.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
      input!.setAttribute("value", "Panela");
      Object.assign(input!, { value: "Panela" });
      input!.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(view.container.textContent).toContain("Panela Eletrica Electrolux");
    expect(view.container.textContent).not.toContain(
      "Kit 2 Macaquinho Curto Fitness Poli Academia",
    );

    view.cleanup();
  });

  it("shows an empty state when the search has no matches", () => {
    const view = renderStorefront();
    const input = view.container.querySelector("input[name='search']");

    expect(input).not.toBeNull();

    act(() => {
      Object.assign(input!, { value: "Notebook gamer" });
      input!.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(view.container.textContent).toContain(
      "Nenhuma oferta combina com a busca atual.",
    );

    view.cleanup();
  });

  it("combines category and search filters", () => {
    const view = renderStorefront();
    const othersButton = [...view.container.querySelectorAll("button")].find(
      (button) => button.textContent?.includes("Outros"),
    );
    const input = view.container.querySelector("input[name='search']");

    expect(othersButton).not.toBeUndefined();
    expect(input).not.toBeNull();

    act(() => {
      othersButton!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      Object.assign(input!, { value: "Kit" });
      input!.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(view.container.textContent).toContain(
      "Kit 2 Macaquinho Curto Fitness Poli Academia",
    );
    expect(view.container.textContent).not.toContain("Panela Eletrica Electrolux");
    expect(view.container.textContent).not.toContain(
      "Mouse Vertical Sem Fio Ergonomico Office Preto",
    );

    view.cleanup();
  });
});
