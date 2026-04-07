/** @format */

'use client';

import { LayoutGridIcon } from 'lucide-react';

import type { CategoryOption } from '@/lib/storefront/category-filters';

import CommandFilter from './command-filter';

type CategoryFilterProps = {
	isPending?: boolean;
	options: readonly CategoryOption[];
	selectedValue: string;
	onValueChange: (value: string) => void;
};

export default function CategoryFilter({
	isPending = false,
	options,
	selectedValue,
	onValueChange,
}: CategoryFilterProps) {
	return (
		<CommandFilter
			label='Categorias'
			placeholder='Selecione uma categoria'
			searchPlaceholder='Buscar categoria...'
			emptyMessage='Nenhuma categoria encontrada.'
			isPending={isPending}
			selectedValue={selectedValue}
			options={options.map((option) => ({
				value: option.value,
				label: option.value === 'all' ? 'Todas as categorias' : option.label,
				count: option.count,
				keywords: [option.label],
			}))}
			onValueChange={onValueChange}
			icon={<LayoutGridIcon className='size-5' />}
		/>
	);
}
