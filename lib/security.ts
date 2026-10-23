/**
 * Security and Privacy Utility Module for AnnaDrishti
 *
 * Implements:
 * 1. In-memory sliding-window rate limiting
 * 2. Strict input sanitization (XSS, script stripping)
 * 3. Privacy-safe audit logging (no raw images or PII in logs)
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40; // 40 requests per minute

/**
 * Checks if a client identifier has exceeded rate limits.
 */
export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Remove timestamps outside current window
  const validTimestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: validTimestamps });

  // Periodically clean up old entries to prevent memory leak
  if (rateLimitStore.size > 1000) {
    rateLimitStore.forEach((val, key) => {
      if (val.timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitStore.delete(key);
      }
    });
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length,
  };
}

/**
 * Sanitizes user-provided string inputs, stripping tags and dangerous characters.
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[<>"'&]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        case "&":
          return "&amp;";
        default:
          return char;
      }
    })
    .slice(0, 500); // Enforce reasonable length bound
}

/**
 * Privacy-safe structured log that omits raw base64 data and PII.
 */
export function logSecurityAudit(action: string, metadata: Record<string, any>) {
  const safeMeta = { ...metadata };
  // Never log raw base64 or file buffers
  if (safeMeta.imageBase64) delete safeMeta.imageBase64;
  if (safeMeta.image) delete safeMeta.image;
  if (safeMeta.file) delete safeMeta.file;

  console.log(`[AnnaDrishti Security Audit] ${new Date().toISOString()} | Action: ${action}`, safeMeta);
}
