import Image from "next/image";

import type { Product } from "@/lib/types/divulgador";

type ProductCardProps = {
  product: Product;
};

const SELLER_LABELS: Record<string, string> = {
  amazon: "Amazon",
  mercadolivre: "Mercado Livre",
  magalu: "Magazine Luiza",
  shopee: "Shopee",
};

function getSellerLabel(seller: string) {
  return SELLER_LABELS[seller] ?? seller;
}

function getCategoryLabel(category: string | null) {
  if (!category) {
    return "Curadoria geral";
  }

  return category.replace(/[-_]+/g, " ");
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-quiet)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <a
        className="flex h-full flex-col"
        href={product.link}
        target="_blank"
        rel="noreferrer"
      >
        <div className="relative min-h-72 overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(255,255,255,0.18))]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(52,64,58,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,64,58,0.03)_1px,transparent_1px)] bg-[size:100%_28px,28px_100%]" />

          <div className="absolute left-5 top-5 right-5 z-10 flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--border)] bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] dark:bg-white/6">
                {getSellerLabel(product.seller)}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] dark:bg-white/6">
                {getCategoryLabel(product.category)}
              </span>
              {product.highlight ? (
                <span className="rounded-full border border-[var(--border)] bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">
                  Destaque
                </span>
              ) : null}
              {product.freeShipping ? (
                <span className="rounded-full border border-[var(--border)] bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] dark:bg-white/6">
                  Frete gratis
                </span>
              ) : null}
            </div>

            <span className="rounded-full border border-[var(--border)] bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)] dark:bg-white/6">
              Record {product.id}
            </span>
          </div>

          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(min-width: 1536px) 36rem, (min-width: 1280px) 44vw, (min-width: 768px) 78vw, 100vw"
              className="object-contain p-10 transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center p-10 text-center">
              <div>
                <p className="font-display text-3xl text-[var(--foreground)]">
                  Image unavailable
                </p>
                <p className="mt-3 max-w-xs text-sm leading-7 text-[var(--muted-foreground)]">
                  Open the source link to inspect the full item record.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
          {product.couponCode ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Coupon code {product.couponCode}
            </p>
          ) : (
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Catalog entry
            </p>
          )}

          <h2 className="mt-4 font-display text-[1.85rem] leading-tight text-[var(--foreground)] sm:text-[2rem]">
            {product.title}
          </h2>

          <div className="mt-6 grid gap-3 rounded-[1.45rem] border border-[var(--border)] bg-white/35 p-4 dark:bg-white/4">
            {product.priceFromLabel ? (
              <p className="text-sm text-[var(--muted-foreground)] line-through">
                {product.priceFromLabel}
              </p>
            ) : null}
            <p className="font-sans text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {product.priceLabel ?? "Consulte o preco"}
            </p>
            {product.installment ? (
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                {product.installment}
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-sm">
            <span className="font-medium text-[var(--foreground)]">
              {product.couponCode
                ? `Open item record - ${product.couponCode}`
                : "Open item record"}
            </span>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-[var(--muted-foreground)]">
              Review
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
