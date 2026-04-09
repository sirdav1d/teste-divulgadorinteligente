/** @format */

import { describe, expect, it } from 'vitest';

import {
	formatCategoryLabel,
	getCategoryLabel,
} from '../../../helpers/storefront/category-filters';

describe('category-filters', () => {
	it('formats category labels for display', () => {
		expect(formatCategoryLabel('home_kitchen')).toBe('Home Kitchen');
		expect(formatCategoryLabel('electronics-fashion')).toBe(
			'Electronics Fashion',
		);
	});

	it('falls back to Outros for empty category labels', () => {
		expect(getCategoryLabel(null)).toBe('Outros');
		expect(getCategoryLabel('  street-wear  ')).toBe('Street Wear');
	});
});
