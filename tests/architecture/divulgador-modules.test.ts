/** @format */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();

describe('divulgador modules architecture', () => {
	it('keeps the public data-layer entrypoint as a thin facade', () => {
		const source = readFileSync(join(projectRoot, 'lib/divulgador.ts'), 'utf8');

		expect(source).toContain(
			"export { getCatalogPage } from '@/lib/divulgador/catalog';",
		);
		expect(source).toContain("export { getCoupons } from '@/lib/divulgador/coupons';");
		expect(source).toContain(
			"export { getProducts, getProductsByCoupon, getProductsPage } from '@/lib/divulgador/products';",
		);
		expect(source).not.toContain('async function fetchCollection');
		expect(source).not.toContain('async function getAvailableCategories');
		expect(source).not.toContain('cacheTag(');
	});

	it('stores divulgador internals in focused modules under lib/divulgador', () => {
		const expectedFiles = [
			'cache-policy.ts',
			'catalog.ts',
			'coupons.ts',
			'products.ts',
			'query.ts',
			'request.ts',
			'scan.ts',
		];

		for (const fileName of expectedFiles) {
			expect(
				existsSync(join(projectRoot, 'lib/divulgador', fileName)),
				fileName,
			).toBe(true);
		}
	});
});
