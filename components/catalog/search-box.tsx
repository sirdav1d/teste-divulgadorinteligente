type SearchBoxProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function SearchBox({
  value,
  onValueChange,
}: SearchBoxProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <label className="flex min-h-16 items-center rounded-[1.75rem] border border-border-soft bg-surface px-5 py-4 shadow-[var(--shadow-soft)] sm:px-6">
        <span className="sr-only">Buscar produtos da vitrine</span>
        <svg
          aria-hidden="true"
          data-slot="search-icon"
          viewBox="0 0 24 24"
          className="mr-3 h-5 w-5 shrink-0 text-foreground-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          className="w-full flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-foreground-muted sm:text-lg"
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
