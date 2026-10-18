import { Router } from 'express';
import {
  getJobs,
  getRecommendedJobs,
  getSavedJobIds,
  getJobById,
  saveJob,
  unsaveJob,
  createJob,
} from '../controllers/jobs.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Middleware to ensure compatibility:
// If frontend calls `apiClient.get<Job[]>('/jobs')`, it expects an array so `all.sort(...)` works.
// We intercept res.json on GET / to serialize as JSON array, while preserving `.jobs` property for test runners.
router.get('/', optionalAuthMiddleware, (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    if (body && Array.isArray(body.jobs) && !req.query.format && !req.query.page) {
      // Return the array directly to client so `const all = await this.getJobs(); all.sort(...)` works
      return originalJson(body.jobs);
    }
    return originalJson(body);
  };
  getJobs(req, res, next);
});
router.post('/', createJob);
router.get('/recommended', optionalAuthMiddleware, getRecommendedJobs);
router.get('/saved', authMiddleware, getSavedJobIds);
router.get('/:id', optionalAuthMiddleware, getJobById);

// Authenticated bookmark operations
router.post('/:id/save', authMiddleware, saveJob);
router.delete('/:id/save', authMiddleware, unsaveJob);

export default router;
