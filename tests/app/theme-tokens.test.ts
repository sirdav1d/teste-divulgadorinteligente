import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("theme tokens", () => {
  it("defines the semantic storefront tokens in globals.css", () => {
    const css = readFileSync(resolve("app/globals.css"), "utf8");

    expect(css).toContain("--color-brand-primary:");
    expect(css).toContain("--color-brand-accent:");
    expect(css).toContain("--color-surface-glass:");
    expect(css).toContain("--color-hero-overlay:");
    expect(css).toContain("--color-state-active:");
    expect(css).toContain("--shadow-float:");
  });
});
