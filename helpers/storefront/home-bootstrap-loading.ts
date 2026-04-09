/** @format */

export const HOME_BOOTSTRAP_LOADING_ATTRIBUTE = 'data-home-bootstrap-loading';
export const HOME_BOOTSTRAP_HERO_READY_EVENT = 'storefront:hero-ready';

const HOME_PATHNAME = '/';

export function shouldEnableHomeBootstrapLoading(
	pathname: string,
	navigationType: string | null,
) {
	return pathname === HOME_PATHNAME && navigationType === 'reload';
}

export function buildHomeBootstrapLoadingScript() {
	return `(() => {
	try {
		const navigationEntry =
			typeof performance !== 'undefined'
				? performance.getEntriesByType('navigation')[0]
				: null;
		const navigationType =
			navigationEntry &&
			typeof navigationEntry === 'object' &&
			'type' in navigationEntry
				? String(navigationEntry.type)
				: null;
		if (window.location.pathname === '${HOME_PATHNAME}' && navigationType === 'reload') {
			document.documentElement.setAttribute('${HOME_BOOTSTRAP_LOADING_ATTRIBUTE}', 'true');
		}
	} catch {}
})();`;
}
