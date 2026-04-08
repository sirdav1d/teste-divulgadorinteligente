/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';

type UseCommandFilterOptions = {
	onValueChange: (value: string) => void;
};

export function useCommandFilter({
	onValueChange,
}: UseCommandFilterOptions) {
	const [open, setOpen] = useState(false);
	const [containerElement, setContainerElement] =
		useState<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

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

	return {
		open,
		setOpen,
		containerElement,
		inputRef,
		handleContainerRef,
		handleSelect,
	};
}
