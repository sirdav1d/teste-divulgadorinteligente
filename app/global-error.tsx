/** @format */

'use client';

type GlobalErrorPageProps = {
	error: Error & { digest?: string };
	unstable_retry: () => void;
};

export default function GlobalErrorPage({
	error,
	unstable_retry,
}: GlobalErrorPageProps) {
	if (process.env.NODE_ENV !== 'test') {
		console.error(error);
	}

	return (
		<html lang='pt-BR'>
			<body className='relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-10 text-foreground'>
				<div className='pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-brand-accent-soft blur-3xl' />
				<div className='pointer-events-none absolute bottom-12 right-12 h-36 w-36 rounded-full bg-brand-accent-soft blur-3xl' />

				<main className='relative w-full max-w-2xl rounded-[2rem] border border-border-soft bg-surface-glass px-8 py-10 shadow-(--shadow-float) backdrop-blur-md'>
					<p className='text-xs font-semibold uppercase tracking-[0.32em] text-foreground-muted'>
						Recuperação global
					</p>
					<h1 className='mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl'>
						A experiência saiu do ar
					</h1>
					<p className='mt-4 max-w-xl text-sm leading-7 text-foreground-muted sm:text-base'>
						Esta camada substituiu o layout raiz. Tente recuperar a experiência
						e retomar a navegação a partir de uma renderização limpa.
					</p>
					<button
						type='button'
						onClick={() => unstable_retry()}
						className='mt-8 inline-flex items-center rounded-full border border-brand-primary bg-brand-primary px-5 py-3 text-sm font-semibold text-text-on-brand transition hover:bg-brand-primary-strong'>
						Tentar recuperar
					</button>
				</main>
			</body>
		</html>
	);
}
