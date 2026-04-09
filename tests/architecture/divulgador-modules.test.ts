/** @format */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();

describe('divulgador modules architecture', () => {
	it('does not keep a facade file at lib/divulgador.ts', () => {
		expect(existsSync(join(projectRoot, 'lib/divulgador.ts'))).toBe(false);
	});

	it('stores divulgador internals in focused modules under lib/divulgador', () => {
		const expectedFiles = [
			'cache-policy.ts',
			'catalog-route.ts',
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

	it('keeps route-local catalog contracts out of app/api/catalog', () => {
		expect(
			existsSync(join(projectRoot, 'app/api/catalog/contract.ts')),
		).toBe(false);
	});
});
