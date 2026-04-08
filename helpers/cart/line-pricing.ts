/** @format */

import type { Product } from '@/types/divulgador';

type CartPricedLine = {
	product: Pick<Product, 'priceValue'>;
	quantity: number;
};

type CartPricedLineWithPrice = {
	product: {
		priceValue: number;
	};
	quantity: number;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

export function formatCurrency(value: number) {
	return currencyFormatter.format(value);
}

export function formatTotal(lines: readonly CartPricedLine[]) {
	const total = lines.reduce(
		(sum, line) => sum + (line.product.priceValue ?? 0) * line.quantity,
		0,
	);

	return formatCurrency(total);
}

export function hasNumericPrice(
	line: CartPricedLine,
): line is CartPricedLineWithPrice {
	return typeof line.product.priceValue === 'number';
}

export function formatLineUnitPrice(line: CartPricedLine) {
	return hasNumericPrice(line) ? formatCurrency(line.product.priceValue) : null;
}

export function formatLineTotal(line: CartPricedLine) {
	return hasNumericPrice(line)
		? formatCurrency(line.product.priceValue * line.quantity)
		: null;
}
