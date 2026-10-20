const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,                 // 5 requests per window
  message: {
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

module.exports = loginRateLimiter;