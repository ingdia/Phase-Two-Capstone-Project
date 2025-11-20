type Bucket = { tokens: number; last: number };

const windowSeconds = Number(process.env.RATE_LIMIT_WINDOW || 60);
const maxPoints = Number(process.env.RATE_LIMIT_POINTS || 120);

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: maxPoints, last: now };
  const elapsed = (now - bucket.last) / 1000;

  // refill tokens
  const refill = elapsed * (maxPoints / windowSeconds);
  bucket.tokens = Math.min(maxPoints, bucket.tokens + refill);
  bucket.last = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, resetIn: windowSeconds };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { ok: true, remaining: Math.floor(bucket.tokens), resetIn: windowSeconds };
}
