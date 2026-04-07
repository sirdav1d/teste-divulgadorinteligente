/** @format */

import Image from 'next/image';

const usefulLinks = [
	{
		label: 'Termos de Servico',
		href: 'https://www.divulgadorinteligente.com/termos-de-uso-e-servico',
	},
	{
		label: 'Politica de Privacidade',
		href: 'https://www.divulgadorinteligente.com/politica-de-privacidade',
	},
];

const socialItems = [
	{
		label: 'Facebook',
		href: 'https://www.facebook.com/divulgadorinteligente/',
		icon: (
			<svg
				aria-hidden='true'
				viewBox='0 0 24 24'
				className='h-4 w-4 fill-current'>
				<path d='M13.5 21v-7.2h2.4l.36-2.8H13.5V9.22c0-.82.22-1.38 1.4-1.38H16.5V5.36c-.28-.04-1.24-.12-2.34-.12-2.32 0-3.92 1.42-3.92 4.04V11H7.8v2.8h2.44V21h3.26Z' />
			</svg>
		),
	},
	{
		label: 'X',
		href: 'https://twitter.com/divulgadorintel',
		icon: (
			<svg
				aria-hidden='true'
				viewBox='0 0 24 24'
				className='h-4 w-4 fill-current'>
				<path d='M17.77 3H20.9l-6.84 7.82L22 21h-6.18l-4.84-6.3L5.47 21H2.33l7.32-8.37L2 3h6.34l4.37 5.77L17.77 3Zm-1.08 16.16h1.73L7.39 4.75H5.53l11.16 14.41Z' />
			</svg>
		),
	},
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/divulgadorinteligente/',
		icon: (
			<svg
				aria-hidden='true'
				viewBox='0 0 24 24'
				className='h-4 w-4 fill-none stroke-current'
				strokeWidth='1.8'>
				<rect
					x='3.75'
					y='3.75'
					width='16.5'
					height='16.5'
					rx='4.5'
				/>
				<circle
					cx='12'
					cy='12'
					r='3.75'
				/>
				<circle
					cx='17.4'
					cy='6.6'
					r='0.9'
					className='fill-current stroke-none'
				/>
			</svg>
		),
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/company/divulgador-inteligente/',
		icon: (
			<svg
				aria-hidden='true'
				viewBox='0 0 24 24'
				className='h-4 w-4 fill-current'>
				<path d='M6.43 8.9a1.83 1.83 0 1 1 0-3.66 1.83 1.83 0 0 1 0 3.66ZM4.86 20V10.43H8V20H4.86Zm4.95 0V10.43h3v1.3h.04c.42-.8 1.45-1.64 2.98-1.64 3.18 0 3.77 2.1 3.77 4.83V20h-3.14v-4.53c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39V20H9.81Z' />
			</svg>
		),
	},
];

export default function StorefrontFooter() {
	return (
		<footer className='relative mt-10 overflow-hidden bg-brand-primary pt-20 text-text-on-brand'>
			<div className='pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden'>
				<div className='absolute left-1/2 top-0 h-32 w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-background' />
			</div>

			<div className='relative mx-auto w-full max-w-[92rem] px-4 pb-8 pt-20 sm:px-6 lg:px-8 xl:px-10'>
				<div className='grid gap-10 lg:grid-cols-[1.2fr_0.9fr_0.8fr_1fr] lg:gap-12'>
					<div className='space-y-6'>
						<Image
							src='/brand/divulgador-inteligente-logo.svg'
							alt='Divulgador Inteligente'
							width={180}
							height={64}
							unoptimized
							sizes='180px'
							className='h-10 w-auto'
						/>

						<p className='max-w-sm text-sm leading-7 text-text-on-hero-muted'>
							Divulgador Inteligente: A ferramenta ideal para divulgar links de
							afiliados da Amazon, Magalu, LTK, Awin, Mercado Livre, Natura e
							Shopee de forma pratica e profissional. Experimente agora com o
							plano gratis!
						</p>

						<div className='flex flex-wrap gap-3'>
							{socialItems.map((item) => (
								<a
									key={item.label}
									href={item.href}
									target='_blank'
									rel='noopener noreferrer'
									aria-label={item.label}
									className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-on-hero bg-surface-on-brand-subtle text-sm font-semibold tracking-[0.14em] text-text-on-brand transition hover:bg-surface-hero-chip'>
									{item.icon}
								</a>
							))}
						</div>
					</div>

					<div className='space-y-5'>
						<h2 className='text-xl font-semibold tracking-[-0.03em] text-white'>
							Fale Conosco
						</h2>
						<div className='space-y-4 text-base leading-8 text-text-on-hero-muted'>
							<a
								href='https://api.whatsapp.com/send?phone=+5511986608692&text=Ol%C3%A1+gostaria+de+saber+mais+como+o+Divulgador+Inteligente+pode+me+ajudar+a+divulgar+mais+promo%C3%A7%C3%B5es+e+vender+mais.'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-start gap-3 transition hover:text-white'>
								<span className='mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-[0.12em]'>
									Tel
								</span>
								<span>(11) 98660-8692</span>
							</a>
							<a
								href='mailto:suporte@divulgadorinteligente.com'
								className='flex items-start gap-3 transition hover:text-white'>
								<span className='mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-[0.08em]'>
									Mail
								</span>
								<span>suporte@divulgadorinteligente.com</span>
							</a>
						</div>
					</div>

					<div className='space-y-5'>
						<h2 className='text-xl font-semibold tracking-[-0.03em] text-white'>
							Links uteis
						</h2>
						<nav className='space-y-3 text-base leading-8 text-text-on-hero-muted'>
							{usefulLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target='_blank'
									rel='noopener noreferrer'
									className='block transition hover:text-white'>
									{link.label}
								</a>
							))}
						</nav>
					</div>

					<div className='space-y-5'>
						<div className='relative rounded-[1.75rem] bg-white px-6 py-6 text-foreground shadow-(--shadow-soft)'>
							<p className='text-sm leading-7'>
								@divulgadorintel E o meu segredo para divulgar bastante e ainda
								ter tempo para produzir conteudo.
							</p>
							<div className='absolute bottom-0 left-10 h-5 w-5 translate-y-1/2 rotate-45 bg-white' />
						</div>
						<p className='text-base leading-8 text-text-on-hero-muted'>
							A Maga das Promos - Jan, 2023
						</p>
					</div>
				</div>

				<div className='mt-12 border-t border-border-on-hero-soft pt-8 text-center text-sm tracking-[0.08em] text-text-on-hero-muted'>
					<a
						href='https://portfolio-dev-ochre-five.vercel.app/'
						target='_blank'
						rel='noopener noreferrer'
						className='transition hover:text-white'>
						David Diniz Dos Santos
					</a>
				</div>
			</div>
		</footer>
	);
}
