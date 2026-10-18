import { Router } from 'express';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  createApplicationSchema,
  updateApplicationSchema,
} from '../controllers/applications.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';

const router = Router();

// All application routes require authentication
router.use(authMiddleware);

router.get('/', getApplications);
router.post('/', validateRequest(createApplicationSchema), createApplication);
router.put('/:id', validateRequest(updateApplicationSchema), updateApplication);
router.delete('/:id', deleteApplication);

export default router;
