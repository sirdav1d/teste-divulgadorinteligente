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
		expect(source).toContain("import StorefrontHeader");
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

	it('keeps a dedicated static hero shell outside the motion client boundary', () => {
		const headerShellPath = join(
			projectRoot,
			'components/storefront/storefront-header-shell.tsx',
		);
		const headerShellSource = readFileSync(headerShellPath, 'utf8');
		const headerSource = readFileSync(
			join(projectRoot, 'components/storefront/storefront-header.tsx'),
			'utf8',
		);

		expect(existsSync(headerShellPath)).toBe(true);
		expect(headerShellSource).not.toContain("'use client'");
		expect(headerSource).toContain("import StorefrontHeaderShell");
		expect(headerSource).toContain("import StorefrontHeroMotion");
	});

	it('keeps hero motion and scroll behavior in a smaller dedicated client component', () => {
		const heroMotionPath = join(
			projectRoot,
			'components/storefront/storefront-hero-motion.tsx',
		);

		expect(existsSync(heroMotionPath)).toBe(true);

		const source = readFileSync(heroMotionPath, 'utf8');

		expect(source).toContain("'use client'");
		expect(source).toContain('useHeroScrollReveal');
		expect(source).toContain('motion');
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
