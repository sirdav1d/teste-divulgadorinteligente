import type { CategoryOption } from "@/lib/storefront/category-filters";

type CategoryFilterProps = {
  options: CategoryOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export default function CategoryFilter({
  options,
  selectedValue,
  onValueChange,
}: CategoryFilterProps) {
  return (
    <section
      aria-label="Categorias do catalogo"
      className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-quiet)] backdrop-blur-sm sm:p-5"
    >
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition",
                isSelected
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] bg-white/45 text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-white/70 dark:bg-white/6 dark:hover:bg-white/10",
              ].join(" ")}
              onClick={() => onValueChange(option.value)}
            >
              <span>{option.label}</span>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-[11px]",
                  isSelected
                    ? "bg-white/20 text-current"
                    : "bg-[var(--accent-soft)] text-[var(--muted-foreground)]",
                ].join(" ")}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
