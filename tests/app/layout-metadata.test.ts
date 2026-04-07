import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
  Plus_Jakarta_Sans: () => ({ variable: "--font-brand-sans" }),
}));

describe("layout metadata", () => {
  it("uses the official local favicon", async () => {
    const { metadata } = (await import("../../app/layout")) as typeof import("../../app/layout");

    expect(metadata.icons).toMatchObject({
      icon: "/brand/divulgador-inteligente-favicon.ico",
      shortcut: "/brand/divulgador-inteligente-favicon.ico",
    });
  });
});
