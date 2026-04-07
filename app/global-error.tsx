"use client";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalErrorPage({
  error,
  unstable_retry,
}: GlobalErrorPageProps) {
  console.error(error);

  return (
    <html lang="pt-BR">
      <body className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
        <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full bg-[var(--sage-soft)] blur-3xl" />

        <main className="relative w-full max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] px-8 py-10 text-[var(--foreground)] shadow-[var(--shadow-quiet)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
            Global issue
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
            The application lost its track
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            This view replaces the root layout. Try to recover the application
            shell and resume navigation from a clean render.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-8 inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-92"
          >
            Try to recover
          </button>
        </main>
      </body>
    </html>
  );
}
