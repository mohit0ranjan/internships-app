import { NextResponse } from 'next/server';

const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Cleanup interval to prevent memory leaks in long-running Node.js processes
// Note: In serverless environments (like Vercel), this map resets every time
// the lambda function spins up or tears down. For true multi-instance production
// rate limiting, this should be replaced with Redis (e.g. Upstash Rate Limit).
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
      if (now > data.resetTime) {
        requestCounts.delete(ip);
      }
    }
  }, 5 * 60 * 1000); // Cleanup every 5 minutes
}

export function rateLimit(
  req: Request,
  limit: number = 60,
  windowMs: number = 60 * 1000 // 1 minute
) {
  // Simple IP extraction
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  const now = Date.now();
  const windowData = requestCounts.get(ip);

  if (!windowData) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  if (now > windowData.resetTime) {
    windowData.count = 1;
    windowData.resetTime = now + windowMs;
    return null;
  }

  windowData.count++;

  if (windowData.count > limit) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil((windowData.resetTime - now) / 1000).toString() } }
    );
  }

  return null;
}
