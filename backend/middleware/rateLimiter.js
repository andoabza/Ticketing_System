const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const { createClient } = require("redis");

// Configure Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.on("error", (err) => console.log("Redis Client Error:", err));
redisClient.connect();

// General rate limiter
const generalRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:general:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
  skip: (req) => {
    // Skip rate limiting for admin users or health checks
    return req.user?.role === "admin" || req.path === "/health";
  },
});

// Strict rate limiter for authentication endpoints
const authRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:auth:",
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many login attempts, please try again later.",
  },
});

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "same-origin");
  next();
};

module.exports = {
  generalRateLimiter,
  authRateLimiter,
  securityHeaders,
};