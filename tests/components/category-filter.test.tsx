import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import CategoryFilter from "../../components/catalog/category-filter";

describe("CategoryFilter", () => {
  it("renders a command trigger for category selection", () => {
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

    expect(html).toContain("Categorias");
    expect(html).toContain("Todas as categorias");
    expect(html).toContain("layout-grid");
    expect(html).toContain("bg-surface");
  });
});
