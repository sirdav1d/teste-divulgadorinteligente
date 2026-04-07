"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({
  error,
  unstable_retry,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
      <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full bg-[var(--sage-soft)] blur-3xl" />

      <section className="relative w-full max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] px-8 py-10 shadow-[var(--shadow-quiet)] backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
          Route issue
        </p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
          Unable to open this issue
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
          Reload this segment to continue reading the catalog. If the problem
          persists, the route integration needs a closer review.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-8 inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-92"
        >
          Reload segment
        </button>
      </section>
    </main>
  );
}
