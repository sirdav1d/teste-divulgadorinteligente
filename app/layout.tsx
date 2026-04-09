import type { Metadata, Viewport } from 'next';
import {
	Geist_Mono,
	Instrument_Serif,
	Plus_Jakarta_Sans,
} from 'next/font/google';

import { buildHomeBootstrapLoadingScript } from '@/helpers/storefront/home-bootstrap-loading';

import './globals.css';

const DEFAULT_METADATA_BASE = 'http://localhost:3000';

function resolveMetadataBase() {
	const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim();

	if (!candidate) {
		return new URL(DEFAULT_METADATA_BASE);
	}

	try {
		return new URL(candidate);
	} catch {
		return new URL(DEFAULT_METADATA_BASE);
	}
}

const brandSans = Plus_Jakarta_Sans({
	variable: '--font-brand-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const heroDisplay = Instrument_Serif({
	variable: '--font-instrument-serif',
	subsets: ['latin'],
	weight: '400',
});

export const metadata: Metadata = {
	metadataBase: resolveMetadataBase(),
	applicationName: 'Divulgador Inteligente',
	title: {
		default: 'Divulgador Inteligente',
		template: '%s | Divulgador Inteligente',
	},
	description:
		'Vitrine premium de produtos, cupons e descoberta visual para o teste técnico da Divulgador Inteligente.',
	icons: {
		icon: '/brand/divulgador-inteligente-favicon.ico',
		shortcut: '/brand/divulgador-inteligente-favicon.ico',
	},
};

export const viewport: Viewport = {
	themeColor: '#f7f5ef',
	colorScheme: 'light',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='pt-BR'
			suppressHydrationWarning
			className={`${brandSans.variable} ${geistMono.variable} ${heroDisplay.variable} h-full antialiased`}>
			<body className='min-h-full bg-background text-foreground'>
				<script
					id='home-bootstrap-loading'
					dangerouslySetInnerHTML={{
						__html: buildHomeBootstrapLoadingScript(),
					}}
				/>
				{children}
			</body>
		</html>
	);
}
