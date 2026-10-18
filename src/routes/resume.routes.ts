import { Router } from 'express';
import { analyzeResume, upload } from '../controllers/resume.controller.js';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Allows analyzing resume both anonymously and authenticated (to persist results)
router.post('/analyze', optionalAuthMiddleware, upload.single('file'), analyzeResume);

export default router;
