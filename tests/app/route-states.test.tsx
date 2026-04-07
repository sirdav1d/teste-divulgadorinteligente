import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "../../app/error";
import GlobalErrorPage from "../../app/global-error";
import Loading from "../../app/loading";

describe("route states", () => {
  it("renders the loading copy", () => {
    const html = renderToStaticMarkup(<Loading />);

    expect(html).toContain("Preparando a vitrine");
    expect(html).toContain(
      "Reunindo produtos, categorias e atmosfera para a selecao atual.",
    );
  });

  it("renders the segment error copy", () => {
    const html = renderToStaticMarkup(
      <ErrorPage
        error={new Error("route failure")}
        unstable_retry={vi.fn()}
      />,
    );

    expect(html).toContain("Nao foi possivel abrir esta vitrine");
    expect(html).toContain("Recarregar trecho");
  });

  it("renders the global error copy", () => {
    const html = renderToStaticMarkup(
      <GlobalErrorPage
        error={new Error("global failure")}
        unstable_retry={vi.fn()}
      />,
    );

    expect(html).toContain("A experiencia saiu do ar");
    expect(html).toContain("Tentar recuperar");
  });
});
