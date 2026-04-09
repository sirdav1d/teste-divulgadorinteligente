/** @format */

import Link from 'next/link';

import { RouteStateShell } from '@/components/shared/route-state-shell';

export default function NotFound() {
	return (
		<RouteStateShell
			eyebrow='Rota indisponível'
			title='Esta página não existe'
			description='A vitrine que você tentou abrir não foi encontrada. Volte para a página inicial e continue a navegação.'
			action={
				<Link
					href='/'
					className='mt-8 inline-flex items-center rounded-full border border-brand-primary bg-brand-primary px-5 py-3 text-sm font-semibold text-text-on-brand transition hover:bg-brand-primary-strong'>
					Voltar ao início
				</Link>
			}
		/>
	);
}
