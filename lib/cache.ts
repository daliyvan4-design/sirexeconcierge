import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

export async function getCached<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  const redis = getRedis();
  if (!redis) return fetcher();

  const cached = await redis.get<T>(`aiko:cache:${key}`);
  if (cached !== null && cached !== undefined) return cached;

  const fresh = await fetcher();
  await redis.set(`aiko:cache:${key}`, JSON.stringify(fresh), { ex: ttlSeconds });
  return fresh;
}

export async function invalidateCache(pattern: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const keys = await redis.keys(`aiko:cache:${pattern}`);
  if (keys.length > 0) {
    await Promise.all(keys.map((k) => redis.del(k)));
  }
}
