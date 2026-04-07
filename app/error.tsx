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
    if (process.env.NODE_ENV !== "test") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-brand-accent-soft blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full bg-brand-accent-soft blur-3xl" />

      <section className="relative w-full max-w-2xl rounded-[2rem] border border-border-soft bg-surface-glass px-8 py-10 shadow-[var(--shadow-float)] backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-foreground-muted">
          Instabilidade de rota
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
          Nao foi possivel abrir esta vitrine
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-muted sm:text-base">
          Recarregue este trecho para retomar a navegacao da selecao atual.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="mt-8 inline-flex items-center rounded-full border border-brand-primary bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-strong"
        >
          Recarregar trecho
        </button>
      </section>
    </main>
  );
}
