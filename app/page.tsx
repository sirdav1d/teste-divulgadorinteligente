import StorefrontClient from "@/components/storefront/storefront-client";
import {
  getCoupons,
  getProducts,
  getProductsByCoupon,
} from "@/lib/api/divulgador";
import { readSingleSearchParam } from "@/lib/storefront/search-params";

type HomePageProps = {
  searchParams: Promise<{
    coupon?: string | string[] | undefined;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCoupon = readSingleSearchParam(resolvedSearchParams.coupon);
  const productsPromise = selectedCoupon
    ? getProductsByCoupon({ coupon: selectedCoupon })
    : getProducts();

  const [products, coupons] = await Promise.all([
    productsPromise,
    getCoupons(),
  ]);

  return (
    <StorefrontClient
      products={products}
      couponCount={coupons.length}
      selectedCoupon={selectedCoupon}
    />
  );
}
