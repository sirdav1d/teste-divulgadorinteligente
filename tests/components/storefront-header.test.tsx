import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import StorefrontHeader from "../../components/storefront/storefront-header";

describe("StorefrontHeader", () => {
  it("renders a lifestyle video hero without the old stat cards", () => {
    const html = renderToStaticMarkup(<StorefrontHeader selectedCoupon={null} />);

    expect(html).toContain("Ofertas em movimento");
    expect(html).toContain("Explorar vitrine");
    expect(html).toContain("<video");
    expect(html).toContain("/videos/storefront-hero.mp4");
    expect(html).not.toContain("Open catalog");
    expect(html).not.toContain("Public coupons");
    expect(html).not.toContain("Coupon state");
  });
});
