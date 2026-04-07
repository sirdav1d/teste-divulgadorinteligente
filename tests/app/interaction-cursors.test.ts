import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("interaction cursors", () => {
  it("uses pointer cursors for clickable elements while preserving text cursors for typing fields", () => {
    const css = readFileSync(resolve("app/globals.css"), "utf8");

    expect(css).toContain("a[href]");
    expect(css).toContain('button');
    expect(css).toContain("label");
    expect(css).toContain('summary');
    expect(css).toContain('[role="button"]');
    expect(css).toContain("cursor: pointer;");
    expect(css).toContain("button:disabled");
    expect(css).toContain("cursor: not-allowed;");
    expect(css).toContain("input:not([type=\"checkbox\"])");
    expect(css).toContain("textarea");
    expect(css).toContain("cursor: text;");
  });
});
