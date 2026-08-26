/**
 * Security Middleware & Utilities
 * - HTTP Security Headers
 * - In-memory IP Rate Limiting (Brute-force & Anti-Spam protection)
 * - Safe URL Validation (Anti-XSS & dangerous protocol blocker)
 * - Input Sanitization & Truncation
 */

// In-Memory sliding-window rate limiter
const createRateLimiter = ({ windowMs = 60 * 1000, max = 100, message = 'Too many requests, please try again later.' }) => {
    const hits = new Map();

    // Clean up expired entries every 5 minutes
    setInterval(() => {
        const now = Date.now();
        for (const [ip, entry] of hits.entries()) {
            if (now - entry.startTime > windowMs) {
                hits.delete(ip);
            }
        }
    }, Math.max(windowMs, 60000));

    return (req, res, next) => {
        // Retrieve client IP (supporting reverse proxies)
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown-ip';
        const now = Date.now();

        const entry = hits.get(ip) || { count: 0, startTime: now };

        if (now - entry.startTime > windowMs) {
            entry.count = 1;
            entry.startTime = now;
        } else {
            entry.count += 1;
        }

        hits.set(ip, entry);

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));

        if (entry.count > max) {
            return res.status(429).json({ error: message });
        }

        next();
    };
};

// Security headers middleware
export const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    next();
};

// Rate limiters for critical endpoints
export const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                  // 10 attempts
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});

export const messageLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,                   // 5 messages per 10 minutes
    message: 'Message rate limit exceeded. Please wait a few minutes before sending another inquiry.'
});

export const apiLimiter = createRateLimiter({
    windowMs: 60 * 1000,      // 1 minute
    max: 200,                 // 200 requests per minute
    message: 'Rate limit exceeded. Please slow down your requests.'
});

/**
 * Validate that a URL uses only safe protocols (http, https, mailto)
 * Protects against `javascript:` or `data:` URL-based XSS injection.
 */
export const isSafeUrl = (urlString) => {
    if (!urlString || typeof urlString !== 'string') return false;
    const trimmed = urlString.trim();
    if (trimmed === '' || trimmed === '#') return true;

    try {
        // Handle mailto separately
        if (trimmed.startsWith('mailto:')) {
            const emailPart = trimmed.slice(7);
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPart);
        }

        const parsed = new URL(trimmed);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        // If relative URL starting with /
        if (trimmed.startsWith('/')) return true;
        return false;
    }
};

export const sanitizeUrl = (urlString) => {
    if (!urlString || typeof urlString !== 'string') return '';
    const trimmed = urlString.trim();
    return isSafeUrl(trimmed) ? trimmed : '';
};

/**
 * Sanitize strings, enforcing length bounds and trimming
 */
export const sanitizeString = (val, maxLength = 1000) => {
    if (val === null || val === undefined) return '';
    if (typeof val !== 'string') val = String(val);
    return val.trim().slice(0, maxLength);
};
