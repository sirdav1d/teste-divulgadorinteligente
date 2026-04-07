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
    <header className="relative flex min-h-[100svh] overflow-hidden rounded-[2.75rem] border border-[var(--border)] bg-[var(--surface)] px-6 py-8 shadow-[var(--shadow-quiet)] backdrop-blur-sm md:px-8 lg:px-12 lg:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 left-20 w-px bg-[linear-gradient(180deg,transparent,var(--border),transparent)]" />
      <div className="pointer-events-none absolute -right-10 top-12 h-56 w-56 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[var(--sage-soft)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.34),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />

      <div className="relative flex w-full flex-col justify-between gap-12">
        <div className="max-w-4xl pt-6 sm:pt-10 lg:pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted-foreground)]">
            Divulgador Inteligente
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.94] text-[var(--foreground)] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            Catalog for calm review
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            Follow a slower route through the current collection. Start with
            context, move into search, narrow by category, and only then compare
            the offers.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/40 p-5 dark:bg-white/4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Open catalog
            </p>
            <p className="mt-3 font-display text-4xl text-[var(--foreground)]">
              {formatCount(totalProducts)}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Records ready for a calmer review cycle.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/40 p-5 dark:bg-white/4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Public coupons
            </p>
            <p className="mt-3 font-display text-4xl text-[var(--foreground)]">
              {formatCount(couponCount)}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Current promotional references available in the source feed.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/40 p-5 dark:bg-white/4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Coupon state
            </p>
            <p className="mt-3 font-display text-3xl text-[var(--foreground)]">
              {selectedCoupon || "No coupon"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              {selectedCoupon
                ? "The catalog is already narrowed by the selected coupon."
                : "Use the search and category rail to review the broad catalog first."}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
