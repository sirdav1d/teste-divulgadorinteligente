export function readSingleSearchParam(
  value: string | string[] | undefined,
) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const normalizedValue = rawValue?.trim();

  return normalizedValue ? normalizedValue : null;
}
