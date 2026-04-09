/** @format */

'use client';

import { RouteStateShell } from '@/components/app/route-state-shell';
import { useLogError } from '@/hooks/app/use-log-error';

type GlobalErrorPageProps = {
	error: Error & { digest?: string };
	unstable_retry: () => void;
};

export default function GlobalErrorPage({
	error,
	unstable_retry,
}: GlobalErrorPageProps) {
	useLogError(error);

	return (
		<html lang='pt-BR'>
			<body className='min-h-svh bg-background text-foreground'>
				<RouteStateShell
					eyebrow='Recuperacao global'
					title='A experiencia saiu do ar'
					description='Esta camada substituiu o layout raiz. Tente recuperar a experiencia e retomar a navegacao a partir de uma renderizacao limpa.'
					action={
						<button
							type='button'
							onClick={() => unstable_retry()}
							className='mt-8 inline-flex items-center rounded-full border border-brand-primary bg-brand-primary px-5 py-3 text-sm font-semibold text-text-on-brand transition hover:bg-brand-primary-strong'>
							Tentar recuperar
						</button>
					}
				/>
			</body>
		</html>
	);
}
