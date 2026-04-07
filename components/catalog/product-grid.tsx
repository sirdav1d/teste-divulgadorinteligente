import type { Product } from "@/lib/types/divulgador";

import ProductCard from "./product-card";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 md:gap-7 xl:grid-cols-2 xl:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
