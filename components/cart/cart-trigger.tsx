/** @format */

'use client';

import { ShoppingBagIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/ui/cn';

type CartTriggerProps = {
	itemCount: number;
	onClick: () => void;
	variant?: 'hero' | 'floating';
};

export default function CartTrigger({
	itemCount,
	onClick,
	variant = 'floating',
}: CartTriggerProps) {
	return (
		<div className='pointer-events-auto'>
			<Button
				type='button'
				variant='outline'
				size='icon-lg'
				aria-label='Abrir carrinho'
				onClick={onClick}
				className={cn(
					'relative size-11 rounded-full border text-sm font-semibold shadow-(--shadow-soft) backdrop-blur-md',
					variant === 'hero'
						? 'border-border-on-hero bg-surface/92 text-foreground hover:bg-surface'
						: 'border-border-soft bg-surface text-foreground hover:bg-surface-elevated',
				)}>
				<ShoppingBagIcon className='size-6' />
				{itemCount > 0 ? (
					<span className='absolute -right-1 -top-1 inline-flex min-w-6 items-center justify-center rounded-full bg-brand-primary-strong px-2 py-0.5 text-xs font-semibold text-surface'>
						{itemCount}
					</span>
				) : null}
			</Button>
		</div>
	);
}
