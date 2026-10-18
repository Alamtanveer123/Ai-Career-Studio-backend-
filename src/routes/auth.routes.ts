import { Router } from 'express';
import { signup, login, getMe, signupSchema, loginSchema } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Strict rate limiter applied to login, signup, and register alias (10 attempts per 15 min per IP)
router.post('/signup', authRateLimiter, validateRequest(signupSchema), signup);
router.post('/register', authRateLimiter, validateRequest(signupSchema), signup);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
router.get('/me', authMiddleware, getMe);

export default router;
