import type { FormEvent } from "react";

type SearchBoxProps = {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
};

export default function SearchBox({
  className = "",
  value,
  onValueChange,
}: SearchBoxProps) {
  function handleInput(event: FormEvent<HTMLInputElement>) {
    onValueChange(event.currentTarget.value);
  }

  return (
    <section className={`mx-auto flex h-16 w-full max-w-6xl ${className}`}>
      <label className="flex h-full w-full items-center rounded-md border border-border-soft bg-surface px-5 py-4 shadow-(--shadow-soft) sm:px-6">
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
          aria-label="Buscar produtos da vitrine"
          autoComplete="off"
          className="w-full flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-sm placeholder:text-foreground-muted sm:text-lg sm:placeholder:text-base"
          enterKeyHint="search"
          name="search"
          placeholder="Busque por produto, categoria ou ocasião"
          type="search"
          value={value}
          onInput={handleInput}
        />
      </label>
    </section>
  );
}
