/** @format */

import type { DivulgadorCollectionResponse } from '@/types/divulgador';

export async function fetchCollection<TAttributes>(url: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Divulgador API request failed with status ${response.status}`,
		);
	}

	return (await response.json()) as DivulgadorCollectionResponse<TAttributes>;
}
