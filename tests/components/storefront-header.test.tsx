import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StorefrontHeader from "../../components/storefront/storefront-header";

describe("StorefrontHeader", () => {
  it("renders the official brand logo with the approved hero media", () => {
    const html = renderToStaticMarkup(<StorefrontHeader />);

    expect(html).toContain("Ofertas em movimento");
    expect(html).toContain("<video");
    expect(html).toContain("/brand/divulgador-inteligente-logo.svg");
    expect(html).toContain("/videos/storefront-hero.mp4");
    expect(html).not.toContain("rounded-[2.75rem]");
    expect(html).toContain("min-h-dvh");
    expect(html).not.toContain("min-h-svh");
    expect(html).toContain("mx-auto w-full max-w-[92rem]");
    expect(html).not.toContain("bg-hero-overlay");
    expect(html).not.toContain("storefront-hero-sheen");
    expect(html).not.toContain("storefront-hero-lights");
    expect(html).not.toContain("Explorar vitrine");
    expect(html).not.toContain("Open catalog");
    expect(html).not.toContain("Public coupons");
    expect(html).not.toContain("Coupon state");
  });
});
