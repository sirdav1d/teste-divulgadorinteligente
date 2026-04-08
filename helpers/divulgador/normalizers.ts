/** @format */

import type {
	Coupon,
	DivulgadorCouponAttributes,
	DivulgadorEntity,
	DivulgadorProductAttributes,
	Product,
} from '@/types/divulgador';
import { parseCurrencyValue } from '@/helpers/currency/parse-currency-value';

export function normalizeProduct(
	item: DivulgadorEntity<DivulgadorProductAttributes>,
): Product {
	const { attributes } = item;

	return {
		id: String(item.id),
		title: attributes.title,
		imageUrl: attributes.image,
		priceLabel: attributes.price,
		priceValue: parseCurrencyValue(attributes.price),
		priceFromLabel: attributes.price_from,
		link: attributes.link,
		seller: attributes.seller,
		couponCode: attributes.coupon,
		installment: attributes.installment,
		highlight: attributes.highlight,
		freeShipping: attributes.free_shipping,
		category: attributes.category,
	};
}

export function normalizeCoupon(
	item: DivulgadorEntity<DivulgadorCouponAttributes>,
): Coupon {
	const { attributes } = item;
	const discountValue = attributes.discount
		? Number(attributes.discount)
		: null;

	return {
		id: String(item.id),
		seller: attributes.seller,
		code: attributes.code,
		title: attributes.title,
		description: attributes.description,
		featured: attributes.featured,
		discountType: attributes.discount_type,
		discountValue,
		discountLabel:
			discountValue === null
				? null
				: attributes.discount_type === 'percent'
					? `${discountValue}%`
					: String(discountValue),
	};
}
