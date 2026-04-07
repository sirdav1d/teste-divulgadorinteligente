import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CategoryFilter from "../../components/catalog/category-filter";

describe("CategoryFilter", () => {
  it("uses a stronger active contrast treatment for the selected category", () => {
    const html = renderToStaticMarkup(
      <CategoryFilter
        options={[
          { value: "all", label: "Todos", count: 20 },
          { value: "beauty", label: "Beauty", count: 3 },
        ]}
        selectedValue="all"
        onValueChange={() => {}}
      />,
    );

    expect(html).toContain("justify-center");
    expect(html).toContain("bg-brand-primary-strong");
    expect(html).toContain("text-surface");
    expect(html).toContain("border-border-strong");
    expect(html).toContain("bg-surface");
  });
});
