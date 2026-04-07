type StatusBannerProps = {
  totalProducts: number;
  visibleProducts: number;
  couponCount: number;
  selectedCoupon: string | null;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function StatusBanner({
  totalProducts,
  visibleProducts,
  couponCount,
  selectedCoupon,
}: StatusBannerProps) {
  const visibleLabel = `${formatCount(visibleProducts)} ${
    visibleProducts === 1 ? "record" : "records"
  }`;
  const totalLabel = `${formatCount(totalProducts)} ${
    totalProducts === 1 ? "item" : "items"
  }`;

  return (
    <section className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-quiet)] backdrop-blur-sm">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,20rem)] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
            Current reading
          </p>
          <p className="mt-4 font-display text-2xl leading-tight text-[var(--foreground)] sm:text-3xl">
            {selectedCoupon
              ? `Coupon ${selectedCoupon} shapes the current issue.`
              : `${couponCount} public coupons remain available for review.`}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            {visibleProducts === totalProducts
              ? `${visibleLabel} currently visible in the open catalog.`
              : `${visibleLabel} after applying a local name filter across ${totalLabel}.`}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/35 px-4 py-4 text-sm leading-7 text-[var(--muted-foreground)] dark:bg-white/4">
          This panel reflects the current issue only. The search stays local and
          keeps the catalog responsive while you review the entries.
        </div>
      </div>
    </section>
  );
}
