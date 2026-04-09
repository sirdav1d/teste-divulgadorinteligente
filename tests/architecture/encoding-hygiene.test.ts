/** @format */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const mojibakePattern = /Ãƒ|Ã|Â|�/;

const filesToCheck = [
	'app/layout.tsx',
	'app/loading.tsx',
	'app/error.tsx',
	'app/global-error.tsx',
	'app/not-found.tsx',
	'components/catalog/product-card.tsx',
	'components/catalog/product-grid.tsx',
	'components/catalog/search-box.tsx',
	'components/catalog/coupon-filter.tsx',
	'components/cart/cart-sheet.tsx',
	'components/storefront/storefront-header.tsx',
	'components/storefront/storefront-header-shell.tsx',
	'tests/components/storefront-client.test.tsx',
];

describe('encoding hygiene', () => {
	it('avoids mojibake in critical runtime and test files', () => {
		for (const relativePath of filesToCheck) {
			const source = readFileSync(join(projectRoot, relativePath), 'utf8');
			expect(source, relativePath).not.toMatch(mojibakePattern);
		}
	});
});
