/**
 * KV-based rate limiter for distributed Workers.
 * Uses sliding window counter with 1-hour expiry.
 */

export type KVNamespace = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
};

export async function checkRateLimit(
  kv: KVNamespace,
  ip: string,
  maxRequests = 20,
  windowSeconds = 3600
): Promise<{ allowed: boolean; remaining: number }> {
  // If KV is not provided (common in local dev), fail open quietly.
  if (!kv) {
    return { allowed: true, remaining: maxRequests };
  }
  const key = `ratelimit:${ip}`;
  const now = Date.now();

  try {
    const data = await kv.get(key);
    const record = data ? JSON.parse(data) : null;

    if (!record || now > record.resetTime) {
      // New window or expired - allow and reset
      await kv.put(
        key,
        JSON.stringify({ count: 1, resetTime: now + windowSeconds * 1000 }),
        { expirationTtl: windowSeconds }
      );
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    // Increment counter
    record.count++;
    await kv.put(
      key,
      JSON.stringify(record),
      { expirationTtl: windowSeconds }
    );

    return { allowed: true, remaining: maxRequests - record.count };
  } catch (error) {
    // On KV error, fail open (allow request) to prevent blocking legitimate users
    console.error("Rate limit KV error:", error);
    return { allowed: true, remaining: maxRequests };
  }
}
