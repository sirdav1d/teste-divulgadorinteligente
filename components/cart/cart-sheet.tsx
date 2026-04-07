/** @format */
/* eslint-disable @next/next/no-img-element */

'use client';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Product } from '@/lib/types/divulgador';

type CartLine = {
	product: Product;
	quantity: number;
};

type CartSheetProps = {
	lines: readonly CartLine[];
	open: boolean;
	onClear: () => void;
	onOpenChange: (open: boolean) => void;
	onRemove: (productId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

function formatTotal(lines: readonly CartLine[]) {
	const total = lines.reduce(
		(sum, line) => sum + (line.product.priceValue ?? 0) * line.quantity,
		0,
	);

	return currencyFormatter.format(total);
}

export default function CartSheet({
	lines,
	open,
	onClear,
	onOpenChange,
	onRemove,
}: CartSheetProps) {
	const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
	const hasItems = lines.length > 0;

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}>
			<SheetContent
				side='right'
				className='w-full max-w-full gap-0 border-l border-border-soft bg-surface p-0 sm:max-w-md'>
				<SheetHeader className='border-b border-border-soft pr-14'>
					<SheetTitle>Seu carrinho</SheetTitle>
					<SheetDescription>
						{hasItems
							? `${itemCount} item${itemCount > 1 ? 'ns' : ''} selecionado${itemCount > 1 ? 's' : ''}.`
							: 'Adicione ofertas para montar sua seleção.'}
					</SheetDescription>
				</SheetHeader>

				<div className='flex-1 overflow-y-auto p-4'>
					{hasItems ? (
						<div className='space-y-3'>
							{lines.map((line) => (
								<article
									key={line.product.id}
									className='flex gap-3 rounded-2xl border border-border-soft bg-background p-3'>
									<div className='relative size-20 shrink-0 overflow-hidden rounded-xl bg-white'>
										{line.product.imageUrl ? (
											<img
												alt={line.product.title}
												loading='lazy'
												className='h-full w-full object-cover'
												src={line.product.imageUrl}
											/>
										) : (
											<div className='flex h-full items-center justify-center px-2 text-center text-xs text-foreground-muted'>
												Imagem indisponível
											</div>
										)}
									</div>

									<div className='min-w-0 flex-1'>
										<div className='flex items-start justify-between gap-3'>
											<div className='min-w-0 space-y-1'>
												<h3 className='line-clamp-2 text-sm font-semibold text-foreground'>
													{line.product.title}
												</h3>
												<p className='text-xs uppercase tracking-[0.18em] text-foreground-muted'>
													{line.product.seller}
												</p>
											</div>
											<Button
												type='button'
												variant='ghost'
												size='icon-sm'
												aria-label={`Remover ${line.product.title} do carrinho`}
												onClick={() => onRemove(line.product.id)}
												className='shrink-0 text-foreground-muted hover:text-foreground'>
												<Trash2Icon className='size-4' />
											</Button>
										</div>

										<div className='mt-3 flex items-center justify-between gap-3'>
											<div className='flex items-center gap-2'>
												<span className='inline-flex rounded-full bg-brand-accent-soft px-2.5 py-1 text-xs font-semibold text-brand-primary-strong'>
													x{line.quantity}
												</span>
												{line.product.couponCode ? (
													<span className='text-xs text-foreground-muted'>
														Cupom {line.product.couponCode}
													</span>
												) : null}
											</div>
											<p className='text-sm font-semibold text-foreground'>
												{line.product.priceLabel ?? 'Consulte o preço'}
											</p>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						<div className='flex min-h-60 items-center justify-center rounded-3xl border border-dashed border-border-soft bg-background px-6 text-center text-sm leading-7 text-foreground-muted'>
							O carrinho ainda está vazio. Escolha produtos na vitrine para ver
							eles aqui.
						</div>
					)}
				</div>

				<SheetFooter className='border-t border-border-soft bg-background/80'>
					<div className='flex items-center justify-between gap-3'>
						<div>
							<p className='text-xs uppercase tracking-[0.18em] text-foreground-muted'>
								Subtotal estimado
							</p>
							<p className='text-lg font-semibold text-foreground'>
								{hasItems ? formatTotal(lines) : 'R$ 0,00'}
							</p>
						</div>
						<Button
							type='button'
							variant='ghost'
							onClick={onClear}
							disabled={!hasItems}>
							Limpar
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
