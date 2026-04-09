/** @format */

'use client';

import { TicketPercentIcon } from 'lucide-react';

import type { CouponOption } from '@/types/catalog';

import CommandFilter from './command-filter';

type CouponFilterProps = {
	isPending?: boolean;
	options: readonly CouponOption[];
	selectedValue: string;
	onValueChange: (value: string) => void;
};

export default function CouponFilter({
	isPending = false,
	options,
	selectedValue,
	onValueChange,
}: CouponFilterProps) {
	return (
		<CommandFilter
			label='Cupons'
			placeholder='Cupons'
			searchPlaceholder='Buscar cupom...'
			emptyMessage='Nenhum cupom disponível.'
			isPending={isPending}
			selectedValue={selectedValue}
			options={options}
			onValueChange={onValueChange}
			icon={<TicketPercentIcon className='size-5' />}
		/>
	);
}
