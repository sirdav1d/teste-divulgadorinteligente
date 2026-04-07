/** @format */

'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { ChevronsUpDownIcon } from 'lucide-react';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

export type CommandFilterOption = {
	value: string;
	label: string;
	description?: string;
	count?: number;
	keywords?: string[];
};

type CommandFilterProps = {
	label: string;
	placeholder: string;
	searchPlaceholder: string;
	emptyMessage: string;
	isPending?: boolean;
	selectedValue: string;
	options: readonly CommandFilterOption[];
	icon: ReactNode;
	onValueChange: (value: string) => void;
};

export default function CommandFilter({
	label,
	placeholder,
	searchPlaceholder,
	emptyMessage,
	isPending = false,
	selectedValue,
	options,
	icon,
	onValueChange,
}: CommandFilterProps) {
	const [open, setOpen] = useState(false);
	const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const selectedOption = options.find((option) => option.value === selectedValue);

	useEffect(() => {
		if (!open) {
			return;
		}

		const frameId = window.requestAnimationFrame(() => {
			inputRef.current?.focus({ preventScroll: true });
		});

		return () => {
			window.cancelAnimationFrame(frameId);
		};
	}, [open]);

	function handleContainerRef(node: HTMLDivElement | null) {
		setContainerElement(node);
	}

	function handleSelect(nextValue: string) {
		onValueChange(nextValue);
		setOpen(false);
	}

	return (
		<div
			ref={handleContainerRef}
			className='relative h-16'>
			<Popover
				open={open}
				onOpenChange={setOpen}>
				<PopoverTrigger
					aria-busy={isPending}
					aria-label={label}
					className='flex h-full w-full items-center justify-between gap-4 rounded-md border border-border-soft bg-surface px-5 py-4 text-left shadow-(--shadow-soft) transition hover:border-brand-primary-strong hover:bg-surface-elevated sm:px-6'>
					<span className='flex min-w-0 items-center gap-3'>
						<span className='inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-brand-primary-strong'>
							{icon}
						</span>
						<span className='min-w-0 flex-1'>
							<span className='sr-only'>{label}</span>
							<span className='block truncate text-xs font-semibold text-foreground sm:text-sm'>
								{selectedOption?.label ?? placeholder}
							</span>
						</span>
					</span>
					{isPending ? (
						<Skeleton className='size-4 shrink-0 rounded-full bg-surface-muted' />
					) : (
						<ChevronsUpDownIcon className='size-4 shrink-0 text-foreground-muted' />
					)}
				</PopoverTrigger>
				<PopoverContent
					align='start'
					collisionAvoidance={{
						side: 'none',
						align: 'shift',
						fallbackAxisSide: 'none',
					}}
					container={containerElement}
					initialFocus={false}
					side='bottom'
					sideOffset={8}
					className='w-80 gap-0 rounded-md border border-border-soft bg-surface p-0 shadow-(--shadow-soft) sm:w-96'>
					<Command className='rounded-md bg-surface p-0 text-foreground'>
						<CommandInput
							ref={inputRef}
							placeholder={searchPlaceholder}
							className='h-10 text-foreground placeholder:text-foreground-muted'
						/>
						<CommandList className='max-h-80 p-1'>
							<CommandEmpty className='py-8 text-foreground-muted'>
								{emptyMessage}
							</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										keywords={option.keywords}
										data-checked={option.value === selectedValue}
										onSelect={() => handleSelect(option.value)}
										className='gap-3 rounded-md px-3 py-3 data-selected:bg-brand-accent-soft data-selected:text-foreground'>
										<p className='min-w-0 flex-1 truncate font-medium text-foreground'>
											{option.label}
										</p>
										{typeof option.count === 'number' ? (
											<CommandShortcut>{String(option.count)}</CommandShortcut>
										) : null}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
