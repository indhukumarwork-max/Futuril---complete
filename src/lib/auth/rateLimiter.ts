// src/lib/auth/rateLimiter.ts
/**
 * Simple in‑memory rate limiter for login attempts.
 * Tracks attempts per IP address and resets after the window expires.
 */
export interface RateLimitRecord {
  count: number;
  firstAttempt: number; // epoch ms
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const store = new Map<string, RateLimitRecord>();

/**
 * Returns true if the request is allowed, false if the limit has been reached.
 * Call this before processing a login request.
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = store.get(ip);
  if (!record) {
    store.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (now - record.firstAttempt > WINDOW_MS) {
    // Window has passed – reset
    store.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  record.count += 1;
  return true;
}

/**
 * Optional helper to manually reset a record (e.g., after successful login).
 */
export function resetRateLimit(ip: string): void {
  store.delete(ip);
}
