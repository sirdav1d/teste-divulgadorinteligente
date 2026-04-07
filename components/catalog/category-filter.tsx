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
    <section aria-label="Categorias do catalogo" className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              className={
                isSelected
                  ? "inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-brand-primary-strong bg-brand-primary-strong px-5 py-2.5 text-sm font-semibold text-surface shadow-[var(--shadow-soft)]"
                  : "inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-brand-primary-strong hover:bg-surface-elevated hover:text-brand-primary-strong"
              }
              onClick={() => onValueChange(option.value)}
            >
              <span>{option.label}</span>
              <span
                className={
                  isSelected
                    ? "rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-brand-primary-strong"
                    : "rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground"
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
