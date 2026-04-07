export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
      <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full bg-[var(--sage-soft)] blur-3xl" />

      <section className="relative w-full max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] px-8 py-10 shadow-[var(--shadow-quiet)] backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
          Reading room
        </p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
          Preparing the catalog
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
          Gathering products and coupons for the current issue.
        </p>
      </section>
    </main>
  );
}
