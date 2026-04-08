export function parseCurrencyValue(value: string | null | undefined) {
	if (!value) {
		return null;
	}

	const normalized = value
		.replace(/\s+/g, '')
		.replace('R$', '')
		.replace(/\./g, '')
		.replace(',', '.');

	const parsed = Number(normalized);

	return Number.isNaN(parsed) ? null : parsed;
}
