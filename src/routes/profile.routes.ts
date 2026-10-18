import { Router } from 'express';
import { getProfile, updateProfile, updateProfileSchema } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);
router.put('/', validateRequest(updateProfileSchema), updateProfile);

export default router;
