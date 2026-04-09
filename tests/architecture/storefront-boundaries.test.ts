/** @format */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();

describe('storefront boundaries architecture', () => {
	it('keeps storefront experience as a server component shell', () => {
		const source = readFileSync(
			join(projectRoot, 'components/storefront/storefront-experience.tsx'),
			'utf8',
		);

		expect(source).not.toContain("'use client'");
		expect(source).toContain("import StorefrontHeroClient");
	});

	it('splits hero and cart interactions into a dedicated client island', () => {
		const heroClientPath = join(
			projectRoot,
			'components/storefront/storefront-hero-client.tsx',
		);

		expect(existsSync(heroClientPath)).toBe(true);

		const source = readFileSync(heroClientPath, 'utf8');

		expect(source).toContain("import { useCart }");
		expect(source).toContain("import { useHeroVisibility }");
	});

	it('keeps cart state inside the catalog client island instead of prop-drilling it', () => {
		const source = readFileSync(
			join(projectRoot, 'components/storefront/storefront-catalog-client.tsx'),
			'utf8',
		);

		expect(source).toContain("import { useCart }");
		expect(source).not.toContain('cartQuantities:');
		expect(source).not.toContain('onIncrement:');
		expect(source).not.toContain('onDecrement:');
	});
});
