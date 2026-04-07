import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("next image remote patterns", () => {
  it("allows product images served by divulgadorinteligente.com", () => {
    const remotePatterns = nextConfig.images?.remotePatterns ?? [];

    expect(remotePatterns).toContainEqual(
      expect.objectContaining({
        protocol: "https",
        hostname: "divulgadorinteligente.com",
      }),
    );
  });

  it("allows product images served by static.netshoes.com.br", () => {
    const remotePatterns = nextConfig.images?.remotePatterns ?? [];

    expect(remotePatterns).toContainEqual(
      expect.objectContaining({
        protocol: "https",
        hostname: "static.netshoes.com.br",
      }),
    );
  });

  it("allows product images served by production.na01.natura.com", () => {
    const remotePatterns = nextConfig.images?.remotePatterns ?? [];

    expect(remotePatterns).toContainEqual(
      expect.objectContaining({
        protocol: "https",
        hostname: "production.na01.natura.com",
        pathname: "/dw/image/**",
      }),
    );
  });
});
