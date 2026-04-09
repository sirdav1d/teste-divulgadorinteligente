/** @format */

import Link from 'next/link';

import { RouteStateShell } from '@/components/app/route-state-shell';

export default function NotFound() {
	return (
		<RouteStateShell
			eyebrow='Rota indisponivel'
			title='Esta pagina nao existe'
			description='A vitrine que voce tentou abrir nao foi encontrada. Volte para a pagina inicial e continue a navegacao.'
			action={
				<Link
					href='/'
					className='mt-8 inline-flex items-center rounded-full border border-brand-primary bg-brand-primary px-5 py-3 text-sm font-semibold text-text-on-brand transition hover:bg-brand-primary-strong'>
					Voltar ao inicio
				</Link>
			}
		/>
	);
}
