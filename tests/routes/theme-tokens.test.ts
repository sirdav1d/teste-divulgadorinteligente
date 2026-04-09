import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("theme tokens", () => {
  it("defines the semantic storefront tokens in globals.css", () => {
    const css = readFileSync(resolve("app/globals.css"), "utf8");

    expect(css).toContain("--color-brand-primary:");
    expect(css).toContain("--color-brand-accent:");
    expect(css).toContain("--color-surface-glass:");
    expect(css).toContain("--color-surface-elevated:");
    expect(css).toContain("--color-surface-hero-chip:");
    expect(css).toContain("--color-surface-hero-chip-muted:");
    expect(css).toContain("--color-hero-overlay:");
    expect(css).toContain("--color-text-on-hero:");
    expect(css).toContain("--color-text-on-hero-muted:");
    expect(css).toContain("--color-border-on-hero:");
    expect(css).toContain("--color-state-active:");
    expect(css).toContain("--shadow-float:");
    expect(css).not.toContain("white/24");
    expect(css).not.toContain("white/88");
  });

  it("uses an atmospheric page background without the grid overlay", () => {
    const css = readFileSync(resolve("app/globals.css"), "utf8");

    expect(css).not.toContain("--page-grid:");
    expect(css).toContain("background-image: var(--page-aura), var(--page-wash);");
  });
});
