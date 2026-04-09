/** @format */

'use client';

import { RouteStateShell } from '@/components/app/route-state-shell';
import { useLogError } from '@/hooks/app/use-log-error';

type ErrorPageProps = {
	error: Error & { digest?: string };
	unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
	useLogError(error);

	return (
		<RouteStateShell
			eyebrow='Instabilidade no app'
			title='Nao foi possivel abrir esta vitrine'
			description='Recarregue a pagina para retomar a navegacao.'
			action={
				<button
					type='button'
					onClick={() => unstable_retry()}
					className='mt-8 inline-flex items-center rounded-full border border-brand-primary bg-brand-primary px-5 py-3 text-sm font-semibold text-text-on-brand transition hover:bg-brand-primary-strong'>
					Recarregar
				</button>
			}
		/>
	);
}
