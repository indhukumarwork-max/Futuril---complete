// src/lib/ai/cache.ts
const cacheMap = new Map<string, string>();

export function getCachedResponse(key: string): string | undefined {
  return cacheMap.get(key);
}

export function setCachedResponse(key: string, response: string): void {
  cacheMap.set(key, response);
}
