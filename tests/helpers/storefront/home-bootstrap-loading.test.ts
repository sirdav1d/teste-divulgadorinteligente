/** @format */

import { describe, expect, it } from 'vitest';

import {
	buildHomeBootstrapLoadingScript,
	HOME_BOOTSTRAP_LOADING_ATTRIBUTE,
	shouldEnableHomeBootstrapLoading,
} from '../../../helpers/storefront/home-bootstrap-loading';

describe('home bootstrap loading helper', () => {
	it('only enables the bootstrap overlay for home hard reloads', () => {
		expect(shouldEnableHomeBootstrapLoading('/', 'reload')).toBe(true);
		expect(shouldEnableHomeBootstrapLoading('/', 'navigate')).toBe(false);
		expect(shouldEnableHomeBootstrapLoading('/', 'back_forward')).toBe(false);
		expect(shouldEnableHomeBootstrapLoading('/ofertas', 'reload')).toBe(
			false,
		);
		expect(HOME_BOOTSTRAP_LOADING_ATTRIBUTE).toBe(
			'data-home-bootstrap-loading',
		);
	});

	it('builds a pre-hydration script that toggles only the document attribute for hard reloads of the home pathname', () => {
		const script = buildHomeBootstrapLoadingScript();

		expect(script).toContain("performance.getEntriesByType('navigation')");
		expect(script).toContain("window.location.pathname === '/'");
		expect(script).toContain(HOME_BOOTSTRAP_LOADING_ATTRIBUTE);
		expect(script).not.toContain('style.backgroundColor');
		expect(script).not.toContain('style.backgroundImage');
	});
});
