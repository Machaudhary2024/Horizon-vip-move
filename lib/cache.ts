/**
 * Caching layer for production scalability
 * Supports both in-memory (dev) and Redis (production)
 */

type CacheStore = "memory" | "redis";

let cacheStore: CacheStore = "memory";
let memoryCache: Map<string, { data: unknown; expires: number }> = new Map();

interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 3600)
}

/**
 * Initialize cache system
 */
export function initializeCache(store: CacheStore = "memory") {
  cacheStore = store;
  if (store === "redis" && !process.env.REDIS_URL) {
    console.warn(
      "Redis URL not configured. Falling back to in-memory cache. Set REDIS_URL for production."
    );
    cacheStore = "memory";
  }
}

/**
 * Get value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (cacheStore === "memory") {
    const cached = memoryCache.get(key);
    if (!cached) return null;
    if (cached.expires < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  // Redis implementation (placeholder for now)
  // TODO: Implement with @vercel/kv or redis client
  return null;
}

/**
 * Set value in cache
 */
export async function cacheSet<T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): Promise<void> {
  const ttl = options.ttl || 3600; // 1 hour default

  if (cacheStore === "memory") {
    memoryCache.set(key, {
      data,
      expires: Date.now() + ttl * 1000,
    });
    return;
  }

  // Redis implementation (placeholder for now)
  // TODO: Implement with @vercel/kv or redis client
}

/**
 * Delete value from cache
 */
export async function cacheDelete(key: string): Promise<void> {
  if (cacheStore === "memory") {
    memoryCache.delete(key);
    return;
  }

  // Redis implementation (placeholder for now)
  // TODO: Implement with @vercel/kv or redis client
}

/**
 * Clear all cache
 */
export async function cacheClear(): Promise<void> {
  if (cacheStore === "memory") {
    memoryCache.clear();
    return;
  }

  // Redis implementation (placeholder for now)
  // TODO: Implement with @vercel/kv or redis client
}

/**
 * Cache-aside pattern helper
 * Gets from cache, or fetches and caches if not found
 */
export async function cacheAside<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try cache first
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  // Fetch and cache
  const data = await fetcher();
  await cacheSet(key, data, options);
  return data;
}

// Cleanup old entries every 5 minutes in memory cache
if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of memoryCache.entries()) {
      if (value.expires < now) {
        memoryCache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
