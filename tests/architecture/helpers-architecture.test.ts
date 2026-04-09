/** @format */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const libRoot = join(projectRoot, 'lib');
const constantsRoot = join(projectRoot, 'constants');
const hooksRoot = join(projectRoot, 'hooks');
const typesRoot = join(projectRoot, 'types');

function listFiles(root: string, current = root): string[] {
	return readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(current, entry.name);

		return entry.isDirectory()
			? listFiles(root, entryPath)
			: [relative(root, entryPath).replace(/\\/g, '/')];
	});
}

function listFilesSorted(root: string) {
	return [...listFiles(root)].sort((left, right) => left.localeCompare(right));
}

describe('helpers architecture', () => {
	it('keeps lib restricted to api and type contracts', () => {
		expect(listFilesSorted(libRoot)).toEqual([
			'divulgador.ts',
			'divulgador/cache-policy.ts',
			'divulgador/catalog.ts',
			'divulgador/coupons.ts',
			'divulgador/products.ts',
			'divulgador/query.ts',
			'divulgador/request.ts',
			'divulgador/scan.ts',
		]);
		expect(existsSync(join(typesRoot, 'divulgador.ts'))).toBe(true);
	});

	it('extracts seller-label helpers out of product-card', () => {
		const source = readFileSync(
			join(projectRoot, 'components/catalog/product-card.tsx'),
			'utf8',
		);

		expect(source).not.toContain('const SELLER_LABELS');
		expect(source).not.toContain('function getSellerLabel');
	});

	it('extracts cart line-pricing helpers out of cart-sheet', () => {
		const source = readFileSync(
			join(projectRoot, 'components/cart/cart-sheet.tsx'),
			'utf8',
		);

		expect(source).not.toContain('function formatCurrency');
		expect(source).not.toContain('function formatTotal');
		expect(source).not.toContain('function hasNumericPrice');
		expect(source).not.toContain('function formatLineUnitPrice');
		expect(source).not.toContain('function formatLineTotal');
	});

	it('avoids toSorted so helpers stay compatible with the current TS target', () => {
		const forbiddenToken = ['.', 'toSorted', '('].join('');
		const filesToCheck = [
			join(projectRoot, 'helpers/storefront/category-filters.ts'),
			join(projectRoot, 'helpers/storefront/coupon-filters.ts'),
			join(projectRoot, 'tests/architecture/helpers-architecture.test.ts'),
		];

		for (const filePath of filesToCheck) {
			const source = readFileSync(filePath, 'utf8');
			expect(source).not.toContain(forbiddenToken);
		}
	});

	it('stores semantic values under constants instead of inline declarations', () => {
		expect(existsSync(join(constantsRoot, 'divulgador/api.ts'))).toBe(true);
		expect(existsSync(join(constantsRoot, 'storefront/filters.ts'))).toBe(true);
		expect(existsSync(join(constantsRoot, 'storefront/pagination.ts'))).toBe(
			true,
		);
		expect(existsSync(join(constantsRoot, 'storefront/sellers.ts'))).toBe(true);

		const categoryFiltersSource = readFileSync(
			join(projectRoot, 'helpers/storefront/category-filters.ts'),
			'utf8',
		);
		const couponFiltersSource = readFileSync(
			join(projectRoot, 'helpers/storefront/coupon-filters.ts'),
			'utf8',
		);
		const sellerLabelSource = readFileSync(
			join(projectRoot, 'helpers/storefront/seller-label.ts'),
			'utf8',
		);
		const buildUrlSource = readFileSync(
			join(projectRoot, 'helpers/divulgador/build-url.ts'),
			'utf8',
		);
		const apiSource = readFileSync(
			join(projectRoot, 'lib/divulgador.ts'),
			'utf8',
		);
		const storefrontCatalogSource = readFileSync(
			join(projectRoot, 'components/storefront/storefront-catalog-client.tsx'),
			'utf8',
		);

		expect(categoryFiltersSource).not.toContain('export const ALL_CATEGORY_VALUE');
		expect(categoryFiltersSource).not.toContain(
			'export const OTHER_CATEGORY_VALUE',
		);
		expect(couponFiltersSource).not.toContain('export const ALL_COUPON_VALUE');
		expect(sellerLabelSource).not.toContain('const SELLER_LABELS');
		expect(buildUrlSource).not.toContain('const API_BASE_URL');
		expect(apiSource).not.toContain('const SITE_NAME');
		expect(storefrontCatalogSource).not.toContain('const PAGE_SIZE');
	});

	it('imports shared production types from the root types directory', () => {
		const catalogSource = readFileSync(
			join(projectRoot, 'lib/divulgador/catalog.ts'),
			'utf8',
		);
		const couponsSource = readFileSync(
			join(projectRoot, 'lib/divulgador/coupons.ts'),
			'utf8',
		);
		const productsSource = readFileSync(
			join(projectRoot, 'lib/divulgador/products.ts'),
			'utf8',
		);

		expect(catalogSource).toContain("from '@/types/divulgador'");
		expect(couponsSource).toContain("from '@/types/divulgador'");
		expect(productsSource).toContain("from '@/types/divulgador'");
		expect(catalogSource).not.toContain('lib/types');
		expect(couponsSource).not.toContain('lib/types');
		expect(productsSource).not.toContain('lib/types');
	});

	it('stores custom hooks under the root hooks directory', () => {
		expect(existsSync(join(hooksRoot, 'storefront/use-storefront-catalog.ts'))).toBe(
			true,
		);
		expect(existsSync(join(hooksRoot, 'storefront/use-cart.ts'))).toBe(true);
		expect(
			existsSync(join(hooksRoot, 'storefront/storefront-catalog-request.ts')),
		).toBe(true);
		expect(
			existsSync(join(hooksRoot, 'storefront/storefront-catalog-state.ts')),
		).toBe(true);
		expect(existsSync(join(hooksRoot, 'storefront/use-hero-visibility.ts'))).toBe(
			true,
		);
		expect(existsSync(join(hooksRoot, 'catalog/use-command-filter.ts'))).toBe(
			true,
		);
		expect(existsSync(join(hooksRoot, 'app/use-log-error.ts'))).toBe(true);

		const storefrontCatalogSource = readFileSync(
			join(projectRoot, 'components/storefront/storefront-catalog-client.tsx'),
			'utf8',
		);
		const storefrontCatalogHookSource = readFileSync(
			join(projectRoot, 'hooks/storefront/use-storefront-catalog.ts'),
			'utf8',
		);
		const cartHookSource = readFileSync(
			join(projectRoot, 'hooks/storefront/use-cart.ts'),
			'utf8',
		);
		const storefrontExperienceSource = readFileSync(
			join(projectRoot, 'components/storefront/storefront-experience.tsx'),
			'utf8',
		);
		const commandFilterSource = readFileSync(
			join(projectRoot, 'components/catalog/command-filter.tsx'),
			'utf8',
		);
		const errorPageSource = readFileSync(join(projectRoot, 'app/error.tsx'), 'utf8');
		const globalErrorPageSource = readFileSync(
			join(projectRoot, 'app/global-error.tsx'),
			'utf8',
		);

		expect(storefrontCatalogSource).not.toContain('function refreshCatalog');
		expect(storefrontCatalogSource).not.toContain('function handleLoadMore');
		expect(storefrontCatalogHookSource).not.toContain('function buildCatalogHref');
		expect(storefrontCatalogHookSource).not.toContain(
			'function buildCatalogRequestUrl',
		);
		expect(storefrontCatalogHookSource).not.toContain('function appendProducts');
		expect(storefrontCatalogHookSource).not.toContain('function fetchCatalogPage');
		expect(cartHookSource).not.toContain('useMemo');
		expect(storefrontExperienceSource).not.toContain('function handleIncrementCart');
		expect(storefrontExperienceSource).not.toContain('new IntersectionObserver');
		expect(commandFilterSource).not.toContain('requestAnimationFrame');
		expect(commandFilterSource).not.toContain('setContainerElement');
		expect(errorPageSource).not.toContain('console.error(error)');
		expect(globalErrorPageSource).not.toContain('console.error(error)');
	});
});
