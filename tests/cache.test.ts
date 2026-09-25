import { describe, it, expect, beforeEach } from "vitest";
import { contractCache } from "@/lib/cache";

describe("Dual-Tier Cache System", () => {
  beforeEach(() => {
    contractCache.clear();
  });

  it("should generate deterministic SHA-256 hash key for input", async () => {
    const input = "Master Services Agreement text";
    const hash1 = await contractCache.hashInput(input);
    const hash2 = await contractCache.hashInput(input);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBeGreaterThan(0);
  });

  it("should return null for cache miss", () => {
    const cached = contractCache.get("non_existent_key");
    expect(cached).toBeNull();
  });

  it("should store and retrieve items from memory cache", async () => {
    const input = "Contract text 123";
    const key = await contractCache.hashInput(input);
    const payload = { result: "Analysis result object" };

    contractCache.set(key, payload);
    const retrieved = contractCache.get<{ result: string }>(key);
    expect(retrieved).toEqual(payload);
  });

  it("should support multiple distinct cache entries", async () => {
    const key1 = await contractCache.hashInput("Text A");
    const key2 = await contractCache.hashInput("Text B");

    contractCache.set(key1, { value: "A" });
    contractCache.set(key2, { value: "B" });

    expect(contractCache.get<{ value: string }>(key1)?.value).toBe("A");
    expect(contractCache.get<{ value: string }>(key2)?.value).toBe("B");
    expect(contractCache.size()).toBe(2);
  });

  it("should clear memory cache", async () => {
    const key = await contractCache.hashInput("Sample");
    contractCache.set(key, { data: "test" });
    expect(contractCache.size()).toBe(1);

    contractCache.clear();
    expect(contractCache.size()).toBe(0);
    expect(contractCache.get(key)).toBeNull();
  });

  it("should handle empty or whitespace input gracefully in hashInput", async () => {
    const hash = await contractCache.hashInput("   ");
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should overwrite existing key when re-set", async () => {
    const key = await contractCache.hashInput("Same text");
    contractCache.set(key, { version: 1 });
    contractCache.set(key, { version: 2 });

    const retrieved = contractCache.get<{ version: number }>(key);
    expect(retrieved?.version).toBe(2);
  });

  it("should handle complex nested object serialization", async () => {
    const key = await contractCache.hashInput("Complex payload");
    const payload = {
      clauses: [{ id: "1", title: "Test", score: 90 }],
      summary: { total: 1 },
    };

    contractCache.set(key, payload);
    const retrieved = contractCache.get<typeof payload>(key);
    expect(retrieved?.clauses[0].title).toBe("Test");
  });

  it("should trim leading and trailing spaces when hashing", async () => {
    const hash1 = await contractCache.hashInput("   Contract Text   ");
    const hash2 = await contractCache.hashInput("Contract Text");
    expect(hash1).toBe(hash2);
  });

  it("should return null if invalid hash key is passed", () => {
    expect(contractCache.get("")).toBeNull();
  });
});
