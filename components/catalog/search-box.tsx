type SearchBoxProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function SearchBox({
  value,
  onValueChange,
}: SearchBoxProps) {
  return (
    <section className="rounded-[1.95rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-quiet)] backdrop-blur-sm sm:p-6">
      <label className="grid gap-4 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:items-center lg:gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            Busca local
          </p>
          <span className="mt-2 block text-sm font-medium text-[var(--foreground)]">
            Buscar no catalogo
          </span>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            Combine texto e categorias sem refetching e revise a amostra atual com resposta imediata.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/45 p-4 dark:bg-white/4">
          <input
            className="mt-3 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            type="search"
            name="search"
            placeholder="Ex.: panela, kit, office"
            value={value}
            onInput={(event) =>
              onValueChange((event.target as HTMLInputElement).value)
            }
            autoComplete="off"
          />
        </div>
      </label>
    </section>
  );
}
