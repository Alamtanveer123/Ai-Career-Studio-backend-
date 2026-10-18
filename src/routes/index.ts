import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import jobsRoutes from './jobs.routes.js';
import applicationsRoutes from './applications.routes.js';
import resumeRoutes from './resume.routes.js';
import interviewsRoutes from './interviews.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/jobs', jobsRoutes);
apiRouter.use('/applications', applicationsRoutes);
apiRouter.use('/resume', resumeRoutes);
apiRouter.use('/interviews', interviewsRoutes);

export default apiRouter;
