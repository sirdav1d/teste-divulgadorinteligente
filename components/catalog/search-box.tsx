type SearchBoxProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function SearchBox({
  value,
  onValueChange,
}: SearchBoxProps) {
  return (
    <section className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-quiet)] backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
        Local filter
      </p>
      <div className="mt-5 rounded-[1.5rem] border border-[var(--border)] bg-white/35 p-4 dark:bg-white/4">
        <label className="block">
          <span className="block text-sm font-medium text-[var(--foreground)]">
            Product name
          </span>
          <input
            className="mt-3 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--border-strong)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            type="search"
            name="search"
            placeholder="Search the current reading issue"
            value={value}
            onInput={(event) =>
              onValueChange((event.target as HTMLInputElement).value)
            }
            autoComplete="off"
          />
        </label>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
        Refine by product name without refetching the catalog.
      </p>
    </section>
  );
}
