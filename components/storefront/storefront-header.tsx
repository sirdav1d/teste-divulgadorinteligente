type StorefrontHeaderProps = {
  totalProducts: number;
  couponCount: number;
  selectedCoupon: string | null;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function StorefrontHeader({
  totalProducts,
  couponCount,
  selectedCoupon,
}: StorefrontHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-8 shadow-[var(--shadow-quiet)] backdrop-blur-sm md:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[var(--sage-soft)] blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,22rem)] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
            Divulgador Inteligente
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[0.98] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Catalog for calm review
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            A quieter storefront for products, coupons, and deliberate
            decision-making.
          </p>
        </div>

        <aside className="rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0.08))] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            Issue notes
          </p>
          <div className="mt-5 grid gap-4">
            <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/35 px-4 py-4 dark:bg-white/4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                Open catalog
              </p>
              <p className="mt-2 font-display text-3xl text-[var(--foreground)]">
                {formatCount(totalProducts)}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Records available in the current reading set.
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border)] bg-white/35 px-4 py-4 dark:bg-white/4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                Coupon coverage
              </p>
              <p className="mt-2 font-display text-3xl text-[var(--foreground)]">
                {selectedCoupon
                  ? selectedCoupon
                  : `${formatCount(couponCount)} live`}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {selectedCoupon
                  ? "This issue is already filtered by the selected coupon."
                  : "No coupon filter applied to the current catalog issue."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
