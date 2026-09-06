/**
 * Rate limiting for API endpoints
 * Prevents abuse and ensures fair usage
 */

import { cacheGet, cacheSet } from "./cache";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyPrefix?: string; // Cache key prefix
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyPrefix: "rate-limit",
};

/**
 * Get rate limit key from request
 * Uses IP address or user ID
 */
function getRateLimitKey(
  identifier: string,
  config: RateLimitConfig
): string {
  return `${config.keyPrefix}:${identifier}`;
}

/**
 * Check if request should be rate limited
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
export async function checkRateLimit(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const key = getRateLimitKey(identifier, finalConfig);

  // Get current count
  const current = (await cacheGet<number>(key)) || 0;
  const allowed = current < finalConfig.maxRequests;

  if (!allowed) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + finalConfig.windowMs,
      retryAfter: finalConfig.windowMs / 1000, // In seconds
    };
  }

  // Increment counter
  const newCount = current + 1;
  await cacheSet(key, newCount, { ttl: finalConfig.windowMs / 1000 });

  return {
    allowed: true,
    remaining: finalConfig.maxRequests - newCount,
    resetTime: Date.now() + finalConfig.windowMs,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Auth endpoints
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  register: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registrations per hour
  },
  forgotPassword: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 requests per hour
  },
  // Booking endpoints
  createBooking: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 bookings per minute per user
  },
  // General API
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
};

/**
 * Express-like middleware for Next.js API routes
 * Usage: const limited = await rateLimitMiddleware(req, "login");
 */
export async function rateLimitMiddleware(
  request: Request,
  limitKey: keyof typeof RATE_LIMITS
): Promise<{
  allowed: boolean;
  headers: Record<string, string>;
  response?: Response;
}> {
  // Get client IP
  const ip =
    (request.headers.get("x-forwarded-for") as string)?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const identifier = ip;
  const result = await checkRateLimit(identifier, RATE_LIMITS[limitKey]);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": RATE_LIMITS[limitKey].maxRequests.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };

  if (!result.allowed) {
    return {
      allowed: false,
      headers,
      response: new Response(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": (result.retryAfter || 60).toString(),
          },
        }
      ),
    };
  }

  return { allowed: true, headers };
}
