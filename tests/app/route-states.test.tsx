import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "../../app/error";
import GlobalErrorPage from "../../app/global-error";
import Loading from "../../app/loading";

describe("route states", () => {
  it("renders the loading copy", () => {
    const html = renderToStaticMarkup(<Loading />);

    expect(html).toContain("Preparing the catalog");
    expect(html).toContain(
      "Gathering products and coupons for the current issue.",
    );
  });

  it("renders the segment error copy", () => {
    const html = renderToStaticMarkup(
      <ErrorPage
        error={new Error("route failure")}
        unstable_retry={vi.fn()}
      />,
    );

    expect(html).toContain("Unable to open this issue");
    expect(html).toContain("Reload segment");
  });

  it("renders the global error copy", () => {
    const html = renderToStaticMarkup(
      <GlobalErrorPage
        error={new Error("global failure")}
        unstable_retry={vi.fn()}
      />,
    );

    expect(html).toContain("The application lost its track");
    expect(html).toContain("Try to recover");
  });
});
