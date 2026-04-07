import { afterEach } from "vitest";

Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  value: ResizeObserverMock,
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value() {},
  writable: true,
});

afterEach(() => {
  document.body.innerHTML = "";
  document.head.querySelectorAll("[data-vitest-cleanup]").forEach((node) => {
    node.remove();
  });
});
