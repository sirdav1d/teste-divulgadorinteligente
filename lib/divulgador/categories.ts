/** @format */

import {
	ALL_CATEGORY_VALUE,
	OTHER_CATEGORY_VALUE,
} from '@/constants/storefront/filters';
import type { CategoryOption } from '@/types/catalog';
import type { Product } from '@/types/divulgador';

function normalizeCategoryValue(category: string) {
	return category.trim();
}

export function isOtherCategory(category: string | null) {
	return !category || !category.trim();
}

export function formatCategoryLabel(category: string) {
	return category
		.trim()
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getCategoryLabel(category: string | null) {
	const normalizedCategory = category?.trim();

	if (!normalizedCategory) {
		return 'Outros';
	}

	return formatCategoryLabel(normalizedCategory);
}

export function buildCategoryOptions(
	products: readonly Product[],
): CategoryOption[] {
	const counts = new Map<string, number>();
	let otherCount = 0;

	for (const product of products) {
		const category = product.category?.trim();

		if (!category) {
			otherCount += 1;
			continue;
		}

		const normalizedCategory = normalizeCategoryValue(category);
		counts.set(
			normalizedCategory,
			(counts.get(normalizedCategory) ?? 0) + 1,
		);
	}

	const options = Array.from(counts.entries())
		.sort(([left], [right]) => left.localeCompare(right, 'pt-BR'))
		.map(([value, count]) => ({
			value,
			label: formatCategoryLabel(value),
			count,
		}));

	return [
		{
			value: ALL_CATEGORY_VALUE,
			label: 'Todos',
			count: products.length,
		},
		...options,
		...(otherCount > 0
			? [
					{
						value: OTHER_CATEGORY_VALUE,
						label: 'Outros',
						count: otherCount,
					},
				]
			: []),
	];
}
