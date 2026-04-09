/** @format */

import { vi } from 'vitest';
import { describe, expect, it } from 'vitest';

vi.mock('next/font/google', () => ({
	Plus_Jakarta_Sans: () => ({ variable: '--font-brand-sans' }),
	Geist_Mono: () => ({ variable: '--font-geist-mono' }),
	Instrument_Serif: () => ({ variable: '--font-instrument-serif' }),
}));

import { metadata, viewport } from '../../app/layout';

describe('root layout contract', () => {
	it('exports structured metadata from the root layout', () => {
		expect(metadata.title).toMatchObject({
			default: expect.any(String),
			template: expect.stringContaining('%s'),
		});
		expect(metadata.applicationName).toBeTypeOf('string');
		expect(metadata.metadataBase).toBeInstanceOf(URL);
		expect(metadata.icons).toMatchObject({
			icon: expect.anything(),
			shortcut: expect.anything(),
		});
	});

	it('exports a static viewport configuration', () => {
		expect(viewport).toMatchObject({
			themeColor: expect.any(String),
		});
	});
});
