/** @format */
/* eslint-disable @next/next/no-img-element */

'use client';

import { useHomeBootstrapProgress } from '@/hooks/storefront/use-home-bootstrap-progress';

export default function StorefrontInitialBootstrap() {
	const { isVisible, isExiting, progress, label } = useHomeBootstrapProgress();
	const isActive = isVisible || isExiting;

	return (
		<div
			role={isActive ? 'status' : undefined}
			aria-live={isActive ? 'polite' : undefined}
			aria-atomic={isActive ? 'true' : undefined}
			aria-label={isActive ? 'Carregamento inicial da home' : undefined}
			aria-hidden={isActive ? 'false' : 'true'}
			data-slot='home-bootstrap-loading'
			data-bootstrap-active={isActive ? 'true' : 'false'}
			className={`fixed inset-0 z-100 flex items-center justify-center bg-brand-primary px-6 py-10 text-text-on-brand transition-opacity duration-160 ${
				isExiting
					? 'pointer-events-none opacity-0'
					: isActive
						? 'opacity-100'
						: 'pointer-events-none opacity-0'
			}`}>
			<div className='relative flex w-full max-w-sm flex-col items-center text-center'>
				<div className='pointer-events-none absolute -top-16 h-48 w-48 rounded-full bg-white/12 blur-3xl' />
				<div className='pointer-events-none absolute -bottom-20 h-56 w-56 rounded-full bg-white/10 blur-3xl' />

				<img
					src='/brand/divulgador-inteligente-logo.svg'
					alt='Divulgador Inteligente'
					width={194}
					height={70}
					decoding='async'
					className='relative h-16 w-auto max-w-full'
				/>

				<p className='relative mt-8 text-sm font-medium tracking-[0.02em] text-text-on-hero-muted sm:text-base'>
					{label}
				</p>

				<div className='relative mt-5 w-full max-w-xs'>
					<div
						aria-hidden='true'
						className='h-2.5 overflow-hidden rounded-full bg-white/18'>
						<div
							className='h-full rounded-full bg-white transition-[width] duration-150 ease-out'
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className='mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.26em] text-white/72'>
						<span>Inicializando</span>
						<span>{progress}%</span>
					</div>
				</div>
			</div>
		</div>
	);
}
