/**
 * Safely parse JSON strings with guaranteed fallback defaults.
 * Prevents throwing errors on malformed JSON or undefined/null.
 */
export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value || typeof value !== 'string') {
    return fallback;
  }
  try {
    const parsed = JSON.parse(value);
    return parsed !== null && parsed !== undefined ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify objects for DB storage.
 */
export function safeJsonStringify(value: unknown, fallback = '[]'): string {
  try {
    return JSON.stringify(value ?? JSON.parse(fallback));
  } catch {
    return fallback;
  }
}
