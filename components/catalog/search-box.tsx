type SearchBoxProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function SearchBox({
  value,
  onValueChange,
}: SearchBoxProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground-muted">
          Busca local
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Buscar na vitrine
        </h2>
        <p className="mt-2 text-sm leading-7 text-foreground-muted">
          Refine a selecao atual sem perder o ritmo da descoberta.
        </p>
      </div>

      <label className="rounded-[1.5rem] border border-border-soft bg-surface px-4 py-4 shadow-[var(--shadow-soft)]">
        <span className="sr-only">Buscar produtos da vitrine</span>
        <input
          className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-foreground-muted"
          name="search"
          placeholder="Busque por produto, categoria ou ocasiao"
          type="search"
          value={value}
          onInput={(event) =>
            onValueChange((event.target as HTMLInputElement).value)
          }
        />
      </label>
    </section>
  );
}
