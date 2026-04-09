/** @format */

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import StorefrontExperience from '../../components/storefront/storefront-experience';
import { resetCartStore } from '../../stores/storefront/cart-store';
import type { CatalogPageResult } from '../../types/catalog';
import type { Coupon, Product } from '../../types/divulgador';

const replaceMock = vi.fn();
const fetchMock = vi.fn();
let replaceStateSpy: ReturnType<typeof vi.spyOn>;

vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useRouter: () => ({
		replace: replaceMock,
	}),
}));

function createProduct(
	index: number,
	overrides: Partial<Product> = {},
): Product {
	return {
		id: `${index}`,
		title: `Produto ${index}`,
		imageUrl: 'https://example.com/product.jpg',
		priceLabel: 'R$\u00a0199,90',
		priceValue: 199.9,
		priceFromLabel: null,
		link: `https://example.com/products/${index}`,
		seller: 'amazon',
		couponCode: null,
		installment: null,
		highlight: false,
		freeShipping: false,
		category: index % 2 === 0 ? 'beauty' : 'electronics',
		...overrides,
	};
}

const products: Product[] = [
	createProduct(1, {
		title: 'Panela Eletrica Electrolux vapor arroz capacidade 1,8L 10 xicaras',
		imageUrl:
			'https://m.media-amazon.com/images/I/515wvq9UoKL._SS500__QL100_.jpg',
		priceLabel: 'R$\u00a0269,82',
		priceValue: 269.82,
		couponCode: 'SEUCUPOM',
		installment: 'ou 6x de R$\u00a045,00',
		category: 'kitchen',
	}),
	createProduct(2, {
		title: 'Kit 2 Macaquinho Curto Fitness Poli Academia',
		imageUrl:
			'https://http2.mlstatic.com/D_Q_NP_2X_837065-MLB90029944053_082025-V-kit-2-macaquinho-curto-fitness-poli-academia.jpeg',
		priceLabel: 'R$\u00a076,69',
		priceValue: 76.69,
		priceFromLabel: 'R$ 199,99',
		link: 'https://meli.la/1bE8Ywd',
		seller: 'mercadolivre',
		couponCode: 'AGORAVAI',
		installment: 'ou 3x de R$\u00a026,91',
		category: null,
	}),
	createProduct(3, {
		title: 'Mouse Vertical Sem Fio Ergonomico Office Preto',
		imageUrl: 'https://m.media-amazon.com/images/I/61mouse.jpg',
		priceLabel: 'R$\u00a0129,90',
		priceValue: 129.9,
		link: 'https://example.com/mouse',
		highlight: true,
		freeShipping: true,
		category: 'office',
	}),
	...Array.from({ length: 37 }, (_, index) =>
		createProduct(index + 4, {
			title:
				index + 4 === 25
					? 'Notebook gamer Nitro 5'
					: index + 4 === 26
						? 'Cadeira office premium'
						: index + 4 === 28
							? 'Mangueira garden premium'
						: `Produto ${index + 4}`,
			category:
				index + 4 === 26
					? 'office'
					: index + 4 === 28
						? 'garden'
						: createProduct(index + 4).category,
		}),
	),
];

const coupons: Coupon[] = [
	{
		id: '1',
		seller: 'amazon',
		code: 'SEUCUPOM',
		title: 'Cupom Amazon',
		description: 'Desconto de 10% em ofertas selecionadas',
		featured: false,
		discountType: 'percent',
		discountValue: 10,
		discountLabel: '10%',
	},
	{
		id: '2',
		seller: 'mercadolivre',
		code: 'AGORAVAI',
		title: 'Cupom Mercado Livre',
		description: 'Oferta especial para macaquinhos fitness',
		featured: false,
		discountType: 'percent',
		discountValue: 15,
		discountLabel: '15%',
	},
];

function buildCatalogPage({
	category = null,
	coupon = null,
	offset = 0,
	search = null,
}: {
	category?: string | null;
	coupon?: string | null;
	offset?: number;
	search?: string | null;
} = {}): CatalogPageResult {
	const categoryCounts = new Map<string, number>();
	let otherCount = 0;
	const couponScopedProducts = products.filter((product) =>
		coupon ? product.couponCode === coupon : true,
	);
	const normalizedSearch = search?.trim().toLocaleLowerCase('pt-BR') ?? '';
	const filteredProducts = products
		.filter((product) => {
			if (!category || category === 'all') {
				return true;
			}

			if (category === 'others') {
				return !product.category;
			}

			return product.category === category;
		})
		.filter((product) =>
			coupon ? product.couponCode === coupon : true,
		)
		.filter((product) =>
			normalizedSearch
				? product.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
				: true,
		);
	const pageProducts = filteredProducts.slice(offset, offset + 20);
	const nextOffset =
		offset + pageProducts.length < filteredProducts.length
			? offset + pageProducts.length
			: null;

	for (const product of couponScopedProducts) {
		const normalizedCategory = product.category?.trim();

		if (!normalizedCategory) {
			otherCount += 1;
			continue;
		}

		categoryCounts.set(
			normalizedCategory,
			(categoryCounts.get(normalizedCategory) ?? 0) + 1,
		);
	}

	const availableCategories = [
		{
			value: 'all',
			label: 'Todos',
			count: couponScopedProducts.length,
		},
		...[...categoryCounts.entries()]
			.sort(([left], [right]) => left.localeCompare(right, 'pt-BR'))
			.map(([value, count]) => ({
				value,
				label: value.replace(/\b\w/g, (letter) => letter.toUpperCase()),
				count,
			})),
		...(otherCount > 0
			? [
					{
						value: 'others',
						label: 'Outros',
						count: otherCount,
					},
				]
			: []),
	];

	return {
		availableCategories,
		products: pageProducts,
		hasMore: nextOffset !== null,
		nextOffset,
	};
}

function renderStorefront({
	selectedCategory = null,
	selectedCoupon = null,
	selectedSearch = null,
}: {
	selectedCategory?: string | null;
	selectedCoupon?: string | null;
	selectedSearch?: string | null;
} = {}) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() => {
		root.render(
			<StorefrontExperience
				catalogPage={buildCatalogPage({
					category: selectedCategory,
					coupon: selectedCoupon,
					search: selectedSearch,
				})}
				coupons={coupons}
				selectedCategory={selectedCategory}
				selectedCoupon={selectedCoupon}
				selectedSearch={selectedSearch}
			/>,
		);
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

beforeEach(() => {
	resetCartStore();
	replaceMock.mockReset();
	fetchMock.mockReset();
	window.history.replaceState(null, '', '/');
	replaceStateSpy = vi.spyOn(window.history, 'replaceState');
	fetchMock.mockImplementation(async (input: string | URL | Request) => {
		const requestUrl =
			typeof input === 'string'
				? input
				: input instanceof URL
					? input.toString()
					: input.url;
		const url = new URL(requestUrl, 'http://localhost');

		if (url.pathname !== '/api/catalog') {
			throw new Error(`Unexpected fetch target: ${url.pathname}`);
		}

		return {
			ok: true,
			json: async () =>
				buildCatalogPage({
					category: url.searchParams.get('category'),
					coupon: url.searchParams.get('coupon'),
					offset: Number.parseInt(
						url.searchParams.get('offset') ?? '0',
						10,
					),
					search: url.searchParams.get('search'),
				}),
		};
	});

	vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
	resetCartStore();
	replaceStateSpy.mockRestore();
	vi.clearAllMocks();
	vi.unstubAllGlobals();
	document.body.innerHTML = '';
});

describe('StorefrontClient', () => {
	it('renders the premium hero, functional search, and coupon/category commands', () => {
		const view = renderStorefront();
		const main = view.container.querySelector('main');
		const header = view.container.querySelector('main > header');
		const filterGrid = view.container.querySelector('#catalogo > div');

		expect(main).not.toBeNull();
		expect(main!.className).not.toContain('px-4');
		expect(main!.className).not.toContain('sm:px-6');
		expect(main!.className).not.toContain('lg:px-8');
		expect(main!.className).not.toContain('xl:px-10');
		expect(header).not.toBeNull();
		expect(filterGrid).not.toBeNull();
		expect(filterGrid!.className).toContain('w-full');
		expect(filterGrid!.className).not.toContain('max-w-6xl');
		expect(view.container.textContent).toContain('Divulgue.Venda.Cresça.');
		expect(view.container.textContent).not.toContain('Busca local');
		expect(view.container.textContent).not.toContain('Buscar na vitrine');
		expect(view.container.textContent).not.toContain(
			'Refine a seleÃ§Ã£o atual sem perder o ritmo da descoberta.',
		);
		expect(view.container.textContent).not.toContain('Categorias do momento');
		expect(view.container.textContent).not.toContain('NavegaÃ§Ã£o');
		expect(view.container.textContent).not.toContain('Catalog for calm review');
		expect(view.container.textContent).toContain('Cupons');
		expect(view.container.textContent).toContain('Todos os cupons');
		expect(view.container.textContent).toContain('Categorias');
		expect(view.container.textContent).toContain('Todas as categorias');
		expect(view.container.textContent).toContain('Outros');
		expect(view.container.textContent).toContain('Panela Eletrica Electrolux');
		expect(view.container.textContent).toContain(
			'Kit 2 Macaquinho Curto Fitness Poli Academia',
		);
		expect(view.container.textContent).toContain(
			'Mouse Vertical Sem Fio Ergonomico Office Preto',
		);
		expect(view.container.textContent).toContain('Ver mais');
		expect(view.container.textContent).not.toContain('Notebook gamer Nitro 5');
		expect(view.container.innerHTML).toContain('mx-auto w-full max-w-368');
		expect(view.container.innerHTML).toContain('sticky top-0 z-30');
		expect(view.container.innerHTML).not.toContain('bg-surface-glass');

		view.cleanup();
	});

	it('searches the full remote catalog as the user types', async () => {
		const view = renderStorefront();
		const input = view.container.querySelector("input[name='search']");

		expect(input).not.toBeNull();

		await act(async () => {
			input!.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
			input!.setAttribute('value', 'Notebook');
			Object.assign(input!, { value: 'Notebook' });
			input!.dispatchEvent(new Event('input', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(fetchMock).toHaveBeenCalled();
		expect(view.container.textContent).toContain('Notebook gamer Nitro 5');
		expect(view.container.textContent).not.toContain(
			'Kit 2 Macaquinho Curto Fitness Poli Academia',
		);

		view.cleanup();
	});

	it('shows remote category options even when they are outside the first loaded page', async () => {
		const view = renderStorefront();
		const categoryButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);

		expect(categoryButton).not.toBeUndefined();
		expect(view.container.textContent).not.toContain('Mangueira garden premium');

		await act(async () => {
			categoryButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		expect(document.body.textContent).toContain('Garden');

		view.cleanup();
	});

	it('shows an empty state when the remote search has no matches', async () => {
		const view = renderStorefront();
		const input = view.container.querySelector("input[name='search']");

		expect(input).not.toBeNull();

		await act(async () => {
			Object.assign(input!, { value: 'Tablet inexistente' });
			input!.dispatchEvent(new Event('input', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(view.container.textContent).toContain(
			'Nenhuma oferta combina com a busca atual.',
		);

		view.cleanup();
	});

	it('combines category and search across the full remote catalog', async () => {
		const view = renderStorefront();
		const othersButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);
		const input = view.container.querySelector("input[name='search']");

		expect(othersButton).not.toBeUndefined();
		expect(input).not.toBeNull();

		act(() => {
			othersButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const categoryOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('Office'));

		expect(categoryOption).not.toBeUndefined();

		await act(async () => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			Object.assign(input!, { value: 'Cadeira' });
			input!.dispatchEvent(new Event('input', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(view.container.textContent).toContain('Cadeira office premium');
		expect(view.container.textContent).not.toContain(
			'Panela Eletrica Electrolux',
		);
		expect(view.container.textContent).not.toContain(
			'Mouse Vertical Sem Fio Ergonomico Office Preto',
		);

		view.cleanup();
	});

	it('loads more remote products and resets the accumulated list when filters change', async () => {
		const view = renderStorefront();
		const loadMoreButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Ver mais'),
		);
		const othersButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);

		expect(loadMoreButton).not.toBeUndefined();
		expect(othersButton).not.toBeUndefined();
		expect(view.container.textContent).not.toContain('Notebook gamer Nitro 5');

		await act(async () => {
			loadMoreButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		const loadMoreRequest = new URL(
			fetchMock.mock.calls.at(-1)![0] as string,
			'http://localhost',
		);

		expect(loadMoreRequest.searchParams.get('offset')).toBe('20');
		expect(loadMoreRequest.searchParams.get('includeCategories')).toBe('0');
		expect(view.container.textContent).toContain('Notebook gamer Nitro 5');

		await act(async () => {
			othersButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		const categoryOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('Outros'));

		expect(categoryOption).not.toBeUndefined();

		await act(async () => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(view.container.textContent).not.toContain('Notebook gamer Nitro 5');
		expect(view.container.textContent).toContain(
			'Kit 2 Macaquinho Curto Fitness Poli Academia',
		);

		view.cleanup();
	});

	it('uses instant scrolling after load more when reduced motion is enabled', async () => {
		const matchMediaMock = vi.fn((query: string) => ({
			matches: query === '(prefers-reduced-motion: reduce)',
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));
		const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView');
		const requestAnimationFrameSpy = vi
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation((callback: FrameRequestCallback) => {
				callback(0);
				return 1;
			});

		vi.stubGlobal('matchMedia', matchMediaMock);

		const view = renderStorefront();

		try {
			const loadMoreButton = [...view.container.querySelectorAll('button')].find(
				(button) => button.textContent?.includes('Ver mais'),
			);

			expect(loadMoreButton).not.toBeUndefined();

			await act(async () => {
				loadMoreButton!.dispatchEvent(
					new MouseEvent('click', { bubbles: true }),
				);
				await Promise.resolve();
				await Promise.resolve();
			});

			expect(matchMediaMock).toHaveBeenCalledWith(
				'(prefers-reduced-motion: reduce)',
			);
			expect(scrollIntoViewSpy).toHaveBeenCalledWith({
				behavior: 'auto',
				block: 'start',
			});
		} finally {
			requestAnimationFrameSpy.mockRestore();
			scrollIntoViewSpy.mockRestore();
			view.cleanup();
		}
	});

	it('syncs the url with native history when the user selects a coupon from the command list', () => {
		const view = renderStorefront();
		const couponButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Cupons'),
		);

		expect(couponButton).not.toBeUndefined();

		act(() => {
			couponButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const couponOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('AGORAVAI'));

		expect(couponOption).not.toBeUndefined();

		act(() => {
			couponOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(couponButton!.textContent).toContain('AGORAVAI');
		expect(replaceMock).not.toHaveBeenCalled();
		expect(replaceStateSpy).toHaveBeenCalledWith(
			null,
			'',
			'/?coupon=AGORAVAI#catalogo',
		);
		expect(window.location.search).toBe('?coupon=AGORAVAI');
		expect(window.location.hash).toBe('#catalogo');

		view.cleanup();
	});

	it('updates the selected category immediately and persists it in the url', () => {
		const view = renderStorefront();
		const categoryButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);

		expect(categoryButton).not.toBeUndefined();

		act(() => {
			categoryButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const categoryOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('Outros'));

		expect(categoryOption).not.toBeUndefined();

		act(() => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(categoryButton!.textContent).toContain('Outros');
		expect(replaceMock).not.toHaveBeenCalled();
		expect(replaceStateSpy).toHaveBeenCalledWith(
			null,
			'',
			'/?category=others#catalogo',
		);
		expect(window.location.search).toBe('?category=others');
		expect(window.location.hash).toBe('#catalogo');

		view.cleanup();
	});

	it('reuses loaded category options when only the selected category changes', async () => {
		const view = renderStorefront();
		const categoryButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);

		expect(categoryButton).not.toBeUndefined();

		await act(async () => {
			categoryButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		const categoryOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('Office'));

		expect(categoryOption).not.toBeUndefined();

		await act(async () => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		const categoryRefreshRequest = new URL(
			fetchMock.mock.calls.at(-1)![0] as string,
			'http://localhost',
		);

		expect(categoryRefreshRequest.searchParams.get('category')).toBe('office');
		expect(categoryRefreshRequest.searchParams.get('includeCategories')).toBe(
			'0',
		);

		view.cleanup();
	});

	it('aborts stale catalog refreshes when filters change in quick succession', async () => {
		const pendingRequests: AbortSignal[] = [];
		const resolvers: Array<(value: { ok: boolean; json: () => Promise<CatalogPageResult> }) => void> =
			[];

		fetchMock.mockImplementation(
			(input: string | URL | Request, init?: RequestInit) => {
			const requestUrl =
				typeof input === 'string'
					? input
					: input instanceof URL
						? input.toString()
						: input.url;

			if (new URL(requestUrl, 'http://localhost').pathname !== '/api/catalog') {
				throw new Error(`Unexpected fetch target: ${requestUrl}`);
			}

			const signal = init?.signal;

			if (!signal) {
				throw new Error('Expected catalog refreshes to send an AbortSignal');
			}

			pendingRequests.push(signal);

			return new Promise((resolve, reject) => {
				resolvers.push(resolve);
				signal.addEventListener(
					'abort',
					() => {
						reject(new DOMException('The operation was aborted.', 'AbortError'));
					},
					{ once: true },
				);
			});
			},
		);

		const view = renderStorefront();
		const couponButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Cupons'),
		);
		const categoryButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);

		expect(couponButton).not.toBeUndefined();
		expect(categoryButton).not.toBeUndefined();

		await act(async () => {
			couponButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		const couponOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('AGORAVAI'));

		expect(couponOption).not.toBeUndefined();

		await act(async () => {
			couponOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(pendingRequests).toHaveLength(1);
		expect(pendingRequests[0]!.aborted).toBe(false);

		await act(async () => {
			categoryButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		const categoryOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('Outros'));

		expect(categoryOption).not.toBeUndefined();

		await act(async () => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		expect(pendingRequests).toHaveLength(2);
		expect(pendingRequests[0]!.aborted).toBe(true);
		expect(pendingRequests[1]!.aborted).toBe(false);

		await act(async () => {
			resolvers[1]!({
				ok: true,
				json: async () => buildCatalogPage(),
			});
			await Promise.resolve();
			await Promise.resolve();
		});

		view.cleanup();
	});

	it('syncs quantity controls between the product card and the cart sheet', async () => {
		const view = renderStorefront();
		const productTitle =
			'Panela Eletrica Electrolux vapor arroz capacidade 1,8L 10 xicaras';
		const productCard = [...view.container.querySelectorAll('article')].find(
			(article) => article.textContent?.includes(productTitle),
		);
		const addToCartButton = [
			...(productCard?.querySelectorAll('button') ?? []),
		].find((button) => button.textContent?.includes('Adicionar ao carrinho'));
		const productAnchor = view.container.querySelector(
			'a[href="https://example.com/products/1"]',
		);

		expect(productCard).not.toBeUndefined();
		expect(addToCartButton).not.toBeUndefined();
		expect(productAnchor).toBeNull();

		act(() => {
			addToCartButton!.dispatchEvent(
				new MouseEvent('click', { bubbles: true }),
			);
		});

		const updatedCard = [...view.container.querySelectorAll('article')].find(
			(article) => article.textContent?.includes(productTitle),
		);
		const cardQuantityValue = updatedCard?.querySelector(
			"[data-slot='cart-quantity-value']",
		);
		const cardDecrementButton = [
			...(updatedCard?.querySelectorAll('button') ?? []),
		].find((button) =>
			button
				.getAttribute('aria-label')
				?.includes(`Remover uma unidade de ${productTitle}`),
		);

		expect(updatedCard?.textContent).not.toContain('Adicionar ao carrinho');
		expect(cardQuantityValue?.textContent).toBe('1');
		expect(cardDecrementButton).not.toBeUndefined();

		const cartTrigger = [...document.querySelectorAll('button')].find(
			(button) => button.getAttribute('aria-label')?.includes('Abrir carrinho'),
		);

		expect(cartTrigger).not.toBeUndefined();
		expect(cartTrigger!.textContent).toContain('1');

		await act(async () => {
			cartTrigger!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await Promise.resolve();
		});

		const sheetContent = document.body.querySelector(
			"[data-slot='sheet-content']",
		);
		const sheetLine = [
			...(sheetContent?.querySelectorAll('article') ?? []),
		].find((article) => article.textContent?.includes(productTitle));
		const sheetQuantityValue = sheetLine?.querySelector(
			"[data-slot='cart-quantity-value']",
		);
		const sheetIncrementButton = [
			...(sheetLine?.querySelectorAll('button') ?? []),
		].find((button) =>
			button
				.getAttribute('aria-label')
				?.includes(`Adicionar uma unidade de ${productTitle}`),
		);
		const sheetDecrementButton = [
			...(sheetLine?.querySelectorAll('button') ?? []),
		].find((button) =>
			button
				.getAttribute('aria-label')
				?.includes(`Remover uma unidade de ${productTitle}`),
		);

		expect(sheetLine).not.toBeUndefined();
		expect(sheetQuantityValue?.textContent).toBe('1');
		expect(document.body.textContent).toContain('R$\u00a0269,82');
		expect(sheetIncrementButton).not.toBeUndefined();
		expect(sheetDecrementButton).not.toBeUndefined();

		act(() => {
			sheetIncrementButton!.dispatchEvent(
				new MouseEvent('click', { bubbles: true }),
			);
		});

		const incrementedCard = [
			...view.container.querySelectorAll('article'),
		].find((article) => article.textContent?.includes(productTitle));
		const incrementedSheetLine = [
			...(sheetContent?.querySelectorAll('article') ?? []),
		].find((article) => article.textContent?.includes(productTitle));

		expect(
			incrementedCard?.querySelector("[data-slot='cart-quantity-value']")
				?.textContent,
		).toBe('2');
		expect(
			incrementedSheetLine?.querySelector("[data-slot='cart-quantity-value']")
				?.textContent,
		).toBe('2');
		expect(incrementedSheetLine?.textContent).toContain('2 x R$\u00a0269,82');
		expect(incrementedSheetLine?.textContent).toContain('R$\u00a0539,64');

		act(() => {
			cardDecrementButton!.dispatchEvent(
				new MouseEvent('click', { bubbles: true }),
			);
		});

		const decrementedCard = [
			...view.container.querySelectorAll('article'),
		].find((article) => article.textContent?.includes(productTitle));
		const decrementedSheetLine = [
			...(sheetContent?.querySelectorAll('article') ?? []),
		].find((article) => article.textContent?.includes(productTitle));

		expect(
			decrementedCard?.querySelector("[data-slot='cart-quantity-value']")
				?.textContent,
		).toBe('1');
		expect(
			decrementedSheetLine?.querySelector("[data-slot='cart-quantity-value']")
				?.textContent,
		).toBe('1');

		act(() => {
			sheetDecrementButton!.dispatchEvent(
				new MouseEvent('click', { bubbles: true }),
			);
		});

		const resetCard = [...view.container.querySelectorAll('article')].find(
			(article) => article.textContent?.includes(productTitle),
		);

		expect(resetCard?.textContent).toContain('Adicionar ao carrinho');

		view.cleanup();
	});
});
