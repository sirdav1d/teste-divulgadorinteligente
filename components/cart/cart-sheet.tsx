/** @format */
/* eslint-disable @next/next/no-img-element */

'use client';

import CartQuantityControl from '@/components/cart/cart-quantity-control';
import {
	formatLineTotal,
	formatLineUnitPrice,
	formatTotal,
	hasNumericPrice,
} from '@/helpers/cart/line-pricing';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Product } from '@/types/divulgador';
import { Trash2 } from 'lucide-react';

type CartLine = {
	product: Product;
	quantity: number;
};

type CartSheetProps = {
	lines: readonly CartLine[];
	open: boolean;
	onClear: () => void;
	onOpenChange: (open: boolean) => void;
	onIncrement: (product: Product) => void;
	onDecrement: (productId: string) => void;
};

export default function CartSheet({
	lines,
	open,
	onClear,
	onOpenChange,
	onIncrement,
	onDecrement,
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
									className='flex items-stretch gap-3 rounded-2xl border border-border-soft bg-background p-3'>
									<div className='relative min-h-20 w-20 shrink-0 self-stretch overflow-hidden rounded-xl bg-white'>
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
										<div className='min-w-0 space-y-1'>
											<h3 className='line-clamp-2 text-sm font-semibold text-foreground'>
												{line.product.title}
											</h3>
											<p className='text-xs uppercase tracking-[0.18em] text-foreground-muted'>
												{line.product.seller}
											</p>
										</div>

										<div className='mt-3 flex items-end justify-between gap-3'>
											<div className='min-w-0 space-y-3'>
												{line.product.couponCode ? (
													<span className='text-xs text-foreground-muted'>
														Cupom {line.product.couponCode}
													</span>
												) : null}
												<CartQuantityControl
													productTitle={line.product.title}
													quantity={line.quantity}
													onIncrement={() => onIncrement(line.product)}
													onDecrement={() => onDecrement(line.product.id)}
													variant='sheet'
												/>
											</div>
											<div className='shrink-0 text-right'>
												{hasNumericPrice(line) ? (
													<>
														<p className='text-[11px] text-foreground-muted tabular-nums'>
															{line.quantity} x {formatLineUnitPrice(line)}
														</p>
														<p className='text-base font-semibold text-foreground tabular-nums sm:text-lg'>
															{formatLineTotal(line)}
														</p>
													</>
												) : (
													<p className='text-sm font-semibold text-foreground'>
														{line.product.priceLabel ?? 'Consulte o preço'}
													</p>
												)}
											</div>
										</div>
									</div>
								</article>
							))}
						</div>
					) : (
						<Empty className='min-h-60 px-6 py-0'>
							<EmptyHeader>
								<EmptyDescription className='mt-0 text-pretty text-sm leading-7'>
									O carrinho ainda está vazio, escolha suas ofertas para fechar
									o pedido
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</div>

				<SheetFooter className='border-t border-border-soft bg-background/80'>
					<div className='flex items-center justify-between gap-3'>
						<div>
							<p className='text-xs uppercase tracking-[0.18em] text-foreground-muted'>
								Subtotal
							</p>
							<p className='text-lg font-semibold text-foreground'>
								{hasItems ? formatTotal(lines) : 'R$\u00a00,00'}
							</p>
						</div>
						<Button
							type='button'
							variant='destructive'
							onClick={onClear}
							disabled={!hasItems}>
							<Trash2 />
							Limpar
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
