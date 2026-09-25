import { describe, it, expect, beforeEach } from "vitest";
import { rateLimiter } from "@/lib/rate-limit";

describe("Sliding Window Rate Limiter", () => {
  beforeEach(() => {
    rateLimiter.clear();
  });

  it("should allow requests under maxLimit threshold", () => {
    const ip = "192.168.1.10";
    const res = rateLimiter.check(ip, { maxRequests: 5, windowMs: 60000 });
    expect(res.success).toBe(true);
    expect(res.remaining).toBe(4);
  });

  it("should block request and return success=false when maxRequests is reached", () => {
    const ip = "192.168.1.20";
    const opts = { maxRequests: 3, windowMs: 60000 };

    rateLimiter.check(ip, opts); // 1
    rateLimiter.check(ip, opts); // 2
    rateLimiter.check(ip, opts); // 3

    const blockedRes = rateLimiter.check(ip, opts); // 4 (exceeded)
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });

  it("should track rate limits independently for different IP addresses", () => {
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";
    const opts = { maxRequests: 2, windowMs: 60000 };

    rateLimiter.check(ipA, opts);
    rateLimiter.check(ipA, opts);
    expect(rateLimiter.check(ipA, opts).success).toBe(false);

    // IP B should still succeed
    expect(rateLimiter.check(ipB, opts).success).toBe(true);
  });

  it("should return resetMs indicator when rate limited", () => {
    const ip = "172.16.0.5";
    const opts = { maxRequests: 1, windowMs: 60000 };

    rateLimiter.check(ip, opts);
    const res = rateLimiter.check(ip, opts);
    expect(res.success).toBe(false);
    expect(res.resetMs).toBeGreaterThan(0);
    expect(res.resetMs).toBeLessThanOrEqual(60000);
  });

  it("should clear all records when clear() is called", () => {
    const ip = "10.0.0.99";
    const opts = { maxRequests: 1, windowMs: 60000 };

    rateLimiter.check(ip, opts);
    expect(rateLimiter.check(ip, opts).success).toBe(false);

    rateLimiter.clear();
    expect(rateLimiter.check(ip, opts).success).toBe(true);
  });

  it("should handle default configuration values cleanly", () => {
    const res = rateLimiter.check("127.0.0.1");
    expect(res.success).toBe(true);
    expect(res.limit).toBe(10);
  });

  it("should filter out expired requests outside sliding window", async () => {
    const ip = "192.168.1.50";
    const opts = { maxRequests: 1, windowMs: 10 }; // 10ms tiny window

    rateLimiter.check(ip, opts);
    expect(rateLimiter.check(ip, opts).success).toBe(false);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 20));

    expect(rateLimiter.check(ip, opts).success).toBe(true);
  });
});
