import crypto from "crypto";
import { RawExtraction } from "./schemas";
import { ProductSearchResult } from "./product-search";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class IntelligenceCache {
  private extractionCache = new Map<string, CacheEntry<RawExtraction>>();
  private searchCache = new Map<string, CacheEntry<ProductSearchResult>>();
  private stats = {
    extractionHits: 0,
    extractionMisses: 0,
    searchHits: 0,
    searchMisses: 0,
  };

  /**
   * Generates a stable SHA-256 hash for image buffers or text queries.
   */
  public generateHash(content: string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  // --- OCR Extraction Caching ---
  public getExtraction(imageHash: string): RawExtraction | null {
    const entry = this.extractionCache.get(imageHash);
    if (!entry) {
      this.stats.extractionMisses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.extractionCache.delete(imageHash);
      this.stats.extractionMisses++;
      return null;
    }

    this.stats.extractionHits++;
    return entry.data;
  }

  public setExtraction(imageHash: string, data: RawExtraction, ttlMs = 60 * 60 * 1000) {
    this.extractionCache.set(imageHash, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
    this.evictOldEntries();
  }

  // --- Product Search Caching ---
  public getSearch(queryKey: string): ProductSearchResult | null {
    const key = queryKey.toLowerCase().trim();
    const entry = this.searchCache.get(key);
    if (!entry) {
      this.stats.searchMisses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.searchCache.delete(key);
      this.stats.searchMisses++;
      return null;
    }

    this.stats.searchHits++;
    return entry.data;
  }

  public setSearch(queryKey: string, data: ProductSearchResult, ttlMs = 2 * 60 * 60 * 1000) {
    const key = queryKey.toLowerCase().trim();
    this.searchCache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
    this.evictOldEntries();
  }

  public getStats() {
    return {
      ...this.stats,
      cachedExtractionsCount: this.extractionCache.size,
      cachedSearchesCount: this.searchCache.size,
    };
  }

  private evictOldEntries() {
    const now = Date.now();
    if (this.extractionCache.size > 200) {
      this.extractionCache.forEach((v, k) => {
        if (now > v.expiresAt) this.extractionCache.delete(k);
      });
    }
    if (this.searchCache.size > 500) {
      this.searchCache.forEach((v, k) => {
        if (now > v.expiresAt) this.searchCache.delete(k);
      });
    }
  }
}

// Global singleton cache instance across server requests
export const memoryCache = new IntelligenceCache();
