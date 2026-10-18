import { Router } from 'express';
import {
  getQuestions,
  evaluateAnswer,
  evaluateAnswerSchema,
} from '../controllers/interviews.controller.js';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

router.get('/questions', getQuestions);
router.post('/evaluate', optionalAuthMiddleware, validateRequest(evaluateAnswerSchema), evaluateAnswer);

export default router;
