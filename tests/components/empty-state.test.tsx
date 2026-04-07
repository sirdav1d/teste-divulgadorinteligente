import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EmptyState from "../../components/shared/empty-state";

describe("EmptyState", () => {
  it("renders the storefront copy with the shadcn empty structure", () => {
    const html = renderToStaticMarkup(
      <EmptyState
        title="Nenhuma oferta combina com a busca atual."
        description="Tente outro termo, troque a categoria ativa ou volte ao estado inicial para revisar a amostra completa."
      />,
    );

    expect(html).toContain('data-slot="empty"');
    expect(html).toContain('data-slot="empty-header"');
    expect(html).toContain('data-slot="empty-media"');
    expect(html).toContain('data-slot="empty-title"');
    expect(html).toContain('data-slot="empty-description"');
    expect(html).toContain("No matching record");
    expect(html).toContain("Nenhuma oferta combina com a busca atual.");
  });
});
