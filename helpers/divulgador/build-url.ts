import { API_BASE_URL } from '@/constants/divulgador/api';

export function buildDivulgadorUrl(
	pathname: string,
	searchParams: URLSearchParams,
) {
	return `${API_BASE_URL}${pathname}?${searchParams.toString()}`;
}
