/** @format */

import { SITE_NAME } from '@/constants/divulgador/api';
import { normalizeCoupon } from '@/helpers/divulgador/normalizers';
import { buildDivulgadorUrl } from '@/helpers/divulgador/build-url';
import type { DivulgadorCouponAttributes } from '@/types/divulgador';

import { applyCouponsCachePolicy } from './cache-policy';
import { fetchCollection } from './request';

export async function getCoupons() {
	'use cache';

	applyCouponsCachePolicy();

	const searchParams = new URLSearchParams({
		sitename: SITE_NAME,
		start: '0',
		limit: '10',
		featured: 'false',
	});

	const payload = await fetchCollection<DivulgadorCouponAttributes>(
		buildDivulgadorUrl('/coupons/public', searchParams),
	);

	return payload.data.map(normalizeCoupon);
}
