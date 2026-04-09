/** @format */

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ErrorPage from '../../app/error';
import GlobalErrorPage from '../../app/global-error';
import Loading from '../../app/loading';
import NotFound from '../../app/not-found';

function renderClientComponent(element: React.ReactNode) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() => {
		root.render(element);
	});

	return {
		container,
		cleanup() {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
}

afterEach(() => {
	document.body.innerHTML = '';
});

describe('route states', () => {
	it('renders a lightweight loading shell', () => {
		const html = renderToStaticMarkup(<Loading />);

		expect(html).toContain('<main');
		expect(html).toContain('<section');
		expect(html).not.toContain('<button');
	});

	it('renders a recoverable segment error boundary', () => {
		const retry = vi.fn();
		const view = renderClientComponent(
			<ErrorPage error={new Error('route failure')} unstable_retry={retry} />,
		);
		const button = view.container.querySelector('button');

		expect(view.container.querySelector('main')).not.toBeNull();
		expect(button?.getAttribute('type')).toBe('button');

		act(() => {
			button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(retry).toHaveBeenCalledTimes(1);

		view.cleanup();
	});

	it('renders a full-document global error boundary', () => {
		const html = renderToStaticMarkup(
			<GlobalErrorPage
				error={new Error('global failure')}
				unstable_retry={vi.fn()}
			/>,
		);

		expect(html).toContain('<html lang="pt-BR"');
		expect(html).toContain('<body');
		expect(html).toContain('<button type="button"');
	});

	it('renders a root not-found state with a home link', () => {
		const html = renderToStaticMarkup(<NotFound />);

		expect(html).toContain('<main');
		expect(html).toContain('href="/"');
		expect(html).not.toContain('<button');
	});
});
