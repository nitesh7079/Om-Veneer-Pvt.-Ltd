/**
 * Simple in-memory cache for API GET responses.
 * Prevents redundant network calls when switching between ERP sections.
 */

const cache = new Map();
const DEFAULT_TTL_MS = 2 * 60 * 1000; // 2 minutes

export const cacheGet = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

export const cacheSet = (key, data, ttlMs = DEFAULT_TTL_MS) => {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
};

export const cacheInvalidate = (prefix) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};

export const cacheClear = () => cache.clear();
