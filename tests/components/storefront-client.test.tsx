/** @format */

import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import StorefrontClient from '../../components/storefront/storefront-client';
import type { Coupon, Product } from '../../lib/types/divulgador';

const replaceMock = vi.fn();

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
	...Array.from({ length: 12 }, (_, index) => createProduct(index + 4)),
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

function renderStorefront() {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() => {
		root.render(
			<StorefrontClient
				coupons={coupons}
				products={products}
				selectedCategory={null}
				selectedCoupon={null}
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

afterEach(() => {
	vi.clearAllMocks();
	document.body.innerHTML = '';
});

describe('StorefrontClient', () => {
	it('renders the premium hero, functional search, and coupon/category commands', () => {
		const view = renderStorefront();
		const main = view.container.querySelector('main');
		const header = view.container.querySelector('main > header');

		expect(main).not.toBeNull();
		expect(main!.className).not.toContain('px-4');
		expect(main!.className).not.toContain('sm:px-6');
		expect(main!.className).not.toContain('lg:px-8');
		expect(main!.className).not.toContain('xl:px-10');
		expect(header).not.toBeNull();
		expect(view.container.textContent).toContain(
			'Ofertas em movimento, com acabamento premium.',
		);
		expect(view.container.textContent).not.toContain('Busca local');
		expect(view.container.textContent).not.toContain('Buscar na vitrine');
		expect(view.container.textContent).not.toContain(
			'Refine a seleção atual sem perder o ritmo da descoberta.',
		);
		expect(view.container.textContent).not.toContain('Categorias do momento');
		expect(view.container.textContent).not.toContain('Navegação');
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
		expect(view.container.textContent).not.toContain('Produto 13');
		expect(view.container.innerHTML).toContain('mx-auto w-full max-w-[92rem]');
		expect(view.container.innerHTML).toContain('sticky top-0 z-30');
		expect(view.container.innerHTML).not.toContain('bg-surface-glass');

		view.cleanup();
	});

	it('filters products by title as the user types', () => {
		const view = renderStorefront();
		const input = view.container.querySelector("input[name='search']");

		expect(input).not.toBeNull();

		act(() => {
			input!.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
			input!.setAttribute('value', 'Panela');
			Object.assign(input!, { value: 'Panela' });
			input!.dispatchEvent(new Event('input', { bubbles: true }));
		});

		expect(view.container.textContent).toContain('Panela Eletrica Electrolux');
		expect(view.container.textContent).not.toContain(
			'Kit 2 Macaquinho Curto Fitness Poli Academia',
		);

		view.cleanup();
	});

	it('shows an empty state when the search has no matches', () => {
		const view = renderStorefront();
		const input = view.container.querySelector("input[name='search']");

		expect(input).not.toBeNull();

		act(() => {
			Object.assign(input!, { value: 'Notebook gamer' });
			input!.dispatchEvent(new Event('input', { bubbles: true }));
		});

		expect(view.container.textContent).toContain(
			'Nenhuma oferta combina com a busca atual.',
		);

		view.cleanup();
	});

	it('combines category and search filters', () => {
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
		].find((node) => node.textContent?.includes('Outros'));

		expect(categoryOption).not.toBeUndefined();

		act(() => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			Object.assign(input!, { value: 'Kit' });
			input!.dispatchEvent(new Event('input', { bubbles: true }));
		});

		expect(view.container.textContent).toContain(
			'Kit 2 Macaquinho Curto Fitness Poli Academia',
		);
		expect(view.container.textContent).not.toContain(
			'Panela Eletrica Electrolux',
		);
		expect(view.container.textContent).not.toContain(
			'Mouse Vertical Sem Fio Ergonomico Office Preto',
		);

		view.cleanup();
	});

	it('reveals 12 more products at a time and resets when filters change', () => {
		const view = renderStorefront();
		const loadMoreButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Ver mais'),
		);
		const othersButton = [...view.container.querySelectorAll('button')].find(
			(button) => button.textContent?.includes('Categorias'),
		);

		expect(loadMoreButton).not.toBeUndefined();
		expect(othersButton).not.toBeUndefined();
		expect(view.container.textContent).not.toContain('Produto 13');

		act(() => {
			loadMoreButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(view.container.textContent).toContain('Produto 13');

		act(() => {
			othersButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const categoryOption = [
			...document.querySelectorAll("[data-slot='command-item']"),
		].find((node) => node.textContent?.includes('Outros'));

		expect(categoryOption).not.toBeUndefined();

		act(() => {
			categoryOption!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(view.container.textContent).not.toContain('Produto 13');
		expect(view.container.textContent).toContain(
			'Kit 2 Macaquinho Curto Fitness Poli Academia',
		);

		view.cleanup();
	});

	it('navigates when the user selects a coupon from the command list', () => {
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
		expect(replaceMock).toHaveBeenCalledWith('/?coupon=AGORAVAI#catalogo', {
			scroll: false,
		});

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
		expect(replaceMock).toHaveBeenCalledWith('/?category=others#catalogo', {
			scroll: false,
		});

		view.cleanup();
	});

	it('adds products to the cart sheet and removes external card anchors', () => {
		const view = renderStorefront();
		const addToCartButton = [...view.container.querySelectorAll('button')].find(
			(button) =>
				button.textContent?.includes('Adicionar ao carrinho') &&
				button.textContent?.includes('Panela') === false,
		);
		const productAnchor = view.container.querySelector(
			'a[href="https://example.com/products/1"]',
		);

		expect(addToCartButton).not.toBeUndefined();
		expect(productAnchor).toBeNull();

		act(() => {
			addToCartButton!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		const cartTrigger = [...document.querySelectorAll('button')].find((button) =>
			button.getAttribute('aria-label')?.includes('Abrir carrinho'),
		);

		expect(cartTrigger).not.toBeUndefined();
		expect(cartTrigger!.textContent).toContain('1');

		act(() => {
			cartTrigger!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(document.body.textContent).toContain(
			'Panela Eletrica Electrolux vapor arroz capacidade 1,8L 10 xicaras',
		);
		expect(document.body.textContent).toContain('R$\u00a0269,82');

		view.cleanup();
	});
});
