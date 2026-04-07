export default function Loading() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-brand-accent-soft blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full bg-brand-accent-soft blur-3xl" />

      <section className="relative w-full max-w-2xl rounded-[2rem] border border-border-soft bg-surface-glass px-8 py-10 shadow-(--shadow-float) backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-foreground-muted">
          Curadoria em andamento
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
          Preparando a vitrine
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-muted sm:text-base">
          Reunindo produtos, categorias e atmosfera para a seleção atual.
        </p>
      </section>
    </main>
  );
}
