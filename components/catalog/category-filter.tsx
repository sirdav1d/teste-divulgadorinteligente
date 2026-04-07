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
    <section aria-label="Categorias do catalogo">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground-muted">
            Navegacao
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
            Categorias do momento
          </h3>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              className={
                isSelected
                  ? "inline-flex items-center gap-2 rounded-full border border-brand-primary bg-brand-primary px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-soft)]"
                  : "inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-state-hover hover:text-brand-primary"
              }
              onClick={() => onValueChange(option.value)}
            >
              <span>{option.label}</span>
              <span
                className={
                  isSelected
                    ? "rounded-full bg-white/18 px-2 py-0.5 text-[11px] text-white"
                    : "rounded-full bg-brand-accent-soft px-2 py-0.5 text-[11px] text-foreground-muted"
                }
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
