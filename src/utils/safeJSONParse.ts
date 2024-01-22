export function safeJSONParse<T extends any>(raw: string, defaultValue: T | null = null): T | null {
  try {
    return JSON.parse(raw);
  } catch (_e: unknown) {
    return defaultValue;
  }
}
