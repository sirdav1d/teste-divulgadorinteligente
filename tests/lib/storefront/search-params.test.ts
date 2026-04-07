import { describe, expect, it } from "vitest";

import { readSingleSearchParam } from "../../../lib/storefront/search-params";

describe("readSingleSearchParam", () => {
  it("returns the string value when the search param is a single string", () => {
    expect(readSingleSearchParam("SEUCUPOM")).toBe("SEUCUPOM");
  });

  it("returns the first value when the search param is an array", () => {
    expect(readSingleSearchParam(["AGORAVAI", "OUTRO"])).toBe("AGORAVAI");
  });

  it("returns null for missing or blank search params", () => {
    expect(readSingleSearchParam(undefined)).toBeNull();
    expect(readSingleSearchParam("")).toBeNull();
    expect(readSingleSearchParam([""])).toBeNull();
  });
});
