/**
 * Dual-Tier Cache System for ContractLens AI
 * Tier 1: In-Memory Map
 * Tier 2: Browser sessionStorage
 * Keyed by SHA-256 string digest of input
 */

class DualTierCache {
  private memoryCache = new Map<string, string>();
  private readonly storagePrefix = "contractlens_cache_";

  /**
   * Generates SHA-256 hash digest for input string
   */
  public async hashInput(input: string): Promise<string> {
    const trimmed = input.trim();

    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(trimmed);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      } catch {
        // Fallback below
      }
    }

    // Pure JS SHA-256/Fowler-Noll-Vo style string hashing fallback for Node / SSR / test
    let hash = 0x811c9dc5;
    for (let i = 0; i < trimmed.length; i++) {
      hash ^= trimmed.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  /**
   * Retrieves item from Tier 1 (Memory) or Tier 2 (sessionStorage)
   */
  public get<T>(hashKey: string): T | null {
    if (!hashKey) return null;

    // Check Tier 1 (Memory)
    if (this.memoryCache.has(hashKey)) {
      const raw = this.memoryCache.get(hashKey);
      if (raw) {
        try {
          return JSON.parse(raw) as T;
        } catch {
          // Ignore
        }
      }
    }

    // Check Tier 2 (sessionStorage)
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const itemKey = this.storagePrefix + hashKey;
        const raw = sessionStorage.getItem(itemKey);
        if (raw) {
          // Promote to Tier 1
          this.memoryCache.set(hashKey, raw);
          return JSON.parse(raw) as T;
        }
      } catch {
        // sessionStorage restricted or disabled
      }
    }

    return null;
  }

  /**
   * Stores item in both Tier 1 and Tier 2
   */
  public set<T>(hashKey: string, value: T): void {
    if (!hashKey) return;
    const serialized = JSON.stringify(value);

    // Save to Tier 1
    this.memoryCache.set(hashKey, serialized);

    // Save to Tier 2
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const itemKey = this.storagePrefix + hashKey;
        sessionStorage.setItem(itemKey, serialized);
      } catch {
        // Handle storage quota full or disabled gracefully
      }
    }
  }

  /**
   * Clears memory and session storage
   */
  public clear(): void {
    this.memoryCache.clear();
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(this.storagePrefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Returns total items in memory cache
   */
  public size(): number {
    return this.memoryCache.size;
  }
}

export const contractCache = new DualTierCache();
