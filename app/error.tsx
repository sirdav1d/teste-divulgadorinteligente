/** @format */

'use client';

import { RouteStateShell } from '@/components/shared/route-state-shell';
import { useLogError } from '@/hooks/shared/use-log-error';

type ErrorPageProps = {
	error: Error & { digest?: string };
	unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
	useLogError(error);

	return (
		<RouteStateShell
			eyebrow='Instabilidade no app'
			title='Não foi possível abrir esta vitrine'
			description='Recarregue a página para retomar a navegação.'
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
