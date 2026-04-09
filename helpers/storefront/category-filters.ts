/** @format */

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
