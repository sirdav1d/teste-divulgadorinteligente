import StorefrontClient from "@/components/storefront/storefront-client";
import { getProducts, getProductsByCoupon } from "@/lib/api/divulgador";
import { readSingleSearchParam } from "@/lib/storefront/search-params";

type HomePageProps = {
  searchParams: Promise<{
    coupon?: string | string[] | undefined;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCoupon = readSingleSearchParam(resolvedSearchParams.coupon);
  const products = selectedCoupon
    ? await getProductsByCoupon({ coupon: selectedCoupon })
    : await getProducts();

  return (
    <StorefrontClient
      products={products}
      selectedCoupon={selectedCoupon}
    />
  );
}
