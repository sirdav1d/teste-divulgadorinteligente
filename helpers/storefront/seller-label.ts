import { SELLER_LABELS } from '@/constants/storefront/sellers';

export function getSellerLabel(seller: string) {
	return SELLER_LABELS[seller] ?? seller;
}
