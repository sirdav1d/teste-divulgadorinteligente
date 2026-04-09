/** @format */

'use client';

import { useEffect } from 'react';

export function useLogError(error: Error) {
	useEffect(() => {
		if (process.env.NODE_ENV !== 'test') {
			console.error(error);
		}
	}, [error]);
}
