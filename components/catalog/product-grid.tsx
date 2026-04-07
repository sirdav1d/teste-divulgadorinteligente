import type { Product } from "@/lib/types/divulgador";

import ProductCard from "./product-card";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section aria-label="Produtos visiveis" className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            Catalogo aberto
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--foreground)] sm:text-[2.5rem]">
            Produtos visiveis
          </h2>
        </div>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          {products.length} registros alinhados com a busca atual.
        </p>
      </div>

      <div className="grid gap-6 md:gap-7 xl:grid-cols-2 xl:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
