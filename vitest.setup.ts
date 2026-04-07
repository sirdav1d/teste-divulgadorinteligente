import { afterEach } from "vitest";

Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
});

afterEach(() => {
  document.body.innerHTML = "";
  document.head.querySelectorAll("[data-vitest-cleanup]").forEach((node) => {
    node.remove();
  });
});
