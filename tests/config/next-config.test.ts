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
});
