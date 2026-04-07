/** @format */

'use client';

import { useEffect, useState, useTransition } from 'react';

import { TicketPercentIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import CommandFilter from './command-filter';
import { ALL_COUPON_VALUE, type CouponOption } from '@/lib/storefront/coupon-filters';

type CouponFilterProps = {
	onPendingChange?: (pending: boolean) => void;
	options: readonly CouponOption[];
	selectedValue: string | null;
};

export default function CouponFilter({
	onPendingChange,
	options,
	selectedValue,
}: CouponFilterProps) {
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const router = useRouter();
	const currentValue = selectedValue ?? ALL_COUPON_VALUE;
	const [optimisticValue, setOptimisticValue] = useState(currentValue);

	useEffect(() => {
		onPendingChange?.(isPending);
	}, [isPending, onPendingChange]);

	useEffect(() => {
		setOptimisticValue(currentValue);
	}, [currentValue]);

	function handleValueChange(nextValue: string) {
		setOptimisticValue(nextValue);

		startTransition(() => {
			const searchParams = new URLSearchParams(window.location.search);

			if (nextValue === ALL_COUPON_VALUE) {
				searchParams.delete('coupon');
			} else {
				searchParams.set('coupon', nextValue);
			}

			const query = searchParams.toString();
			const href = query ? `${pathname}?${query}#catalogo` : `${pathname}#catalogo`;
			router.replace(href, { scroll: false });
		});
	}

	return (
		<CommandFilter
			label='Cupons'
			placeholder='Cupons'
			searchPlaceholder='Buscar cupom...'
			emptyMessage='Nenhum cupom disponível.'
			isPending={isPending}
			selectedValue={optimisticValue}
			options={options}
			onValueChange={handleValueChange}
			icon={<TicketPercentIcon className='size-5' />}
		/>
	);
}
