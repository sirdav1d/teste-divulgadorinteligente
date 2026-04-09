/** @format */

import { MinusIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/helpers/ui/cn';

type CartQuantityControlProps = {
	productTitle: string;
	quantity: number;
	onIncrement?: () => void;
	onDecrement?: () => void;
	variant?: 'card' | 'sheet';
	className?: string;
};

export default function CartQuantityControl({
	productTitle,
	quantity,
	onIncrement,
	onDecrement,
	variant = 'card',
	className,
}: CartQuantityControlProps) {
	return (
		<div
			data-slot='cart-quantity-control'
			className={cn(
				'inline-flex items-center justify-between rounded-full border border-border-soft bg-surface shadow-(--shadow-soft)',
				variant === 'card' ? 'h-11 w-full px-1.5' : 'h-10 min-w-32 px-1.5',
				className,
			)}>
			<Button
				type='button'
				variant='ghost'
				size='icon-sm'
				aria-label={`Remover uma unidade de ${productTitle}`}
				disabled={!onDecrement}
				onClick={onDecrement}
				className='rounded-full text-brand-primary-strong hover:bg-brand-accent-soft hover:text-brand-primary'>
				<MinusIcon className='size-4' />
			</Button>

			<span
				data-slot='cart-quantity-value'
				aria-live='polite'
				aria-atomic='true'
				className='min-w-8 text-center text-sm font-semibold tabular-nums text-foreground'>
				{quantity}
			</span>

			<Button
				type='button'
				variant='ghost'
				size='icon-sm'
				aria-label={`Adicionar uma unidade de ${productTitle}`}
				disabled={!onIncrement}
				onClick={onIncrement}
				className='rounded-full text-brand-primary-strong hover:bg-brand-accent-soft hover:text-brand-primary'>
				<PlusIcon className='size-4' />
			</Button>
		</div>
	);
}
