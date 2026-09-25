/**
 * Sliding Window Rate Limiter for ContractLens AI API Routes
 * Tracks requests per IP address within a configurable window duration.
 */

interface RateLimitEntry {
  timestamps: number[];
}

export interface RateLimitOptions {
  windowMs?: number; // Time window in ms (default: 60,000 ms = 1 minute)
  maxRequests?: number; // Max requests per window (default: 10)
}

class SlidingWindowRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private defaultWindowMs: number;
  private defaultMaxRequests: number;

  constructor(windowMs = 60000, maxRequests = 10) {
    this.defaultWindowMs = windowMs;
    this.defaultMaxRequests = maxRequests;
  }

  public check(
    ip: string,
    options?: RateLimitOptions
  ): {
    success: boolean;
    limit: number;
    remaining: number;
    resetMs: number;
  } {
    const windowMs = options?.windowMs ?? this.defaultWindowMs;
    const maxRequests = options?.maxRequests ?? this.defaultMaxRequests;
    const now = Date.now();
    const windowStart = now - windowMs;

    let entry = this.store.get(ip);
    if (!entry) {
      entry = { timestamps: [] };
      this.store.set(ip, entry);
    }

    // Filter out timestamps older than the sliding window
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

    if (entry.timestamps.length >= maxRequests) {
      const oldestInWindow = entry.timestamps[0];
      const resetMs = Math.max(0, oldestInWindow + windowMs - now);
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        resetMs,
      };
    }

    // Record request
    entry.timestamps.push(now);

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - entry.timestamps.length,
      resetMs: windowMs,
    };
  }

  public clear(): void {
    this.store.clear();
  }
}

export const rateLimiter = new SlidingWindowRateLimiter(60000, 10);
