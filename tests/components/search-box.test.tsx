import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import SearchBox from "../../components/catalog/search-box";

describe("SearchBox", () => {
  it("renders a search icon alongside the input", () => {
    const html = renderToStaticMarkup(
      <SearchBox value="" onValueChange={() => {}} />,
    );

    expect(html).toContain('data-slot="search-icon"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('name="search"');
  });
});
