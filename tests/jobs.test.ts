import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('Jobs Endpoints & Server-Side Match Scoring', () => {
  let authToken = '';
  let testUserId = '';
  const testJobId = 'job-1';

  beforeAll(async () => {
    // Login with demo user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tanveer.alam@example.com',
        password: 'Password123!',
      });

    if (loginRes.status === 200 && loginRes.body.token) {
      authToken = loginRes.body.token;
      testUserId = loginRes.body.user.id;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/jobs', () => {
    it('should return a list of jobs with valid arrays and matchScore', async () => {
      const res = await request(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('jobs');
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeGreaterThan(0);

      const job = res.body.jobs[0];
      expect(job).toHaveProperty('id');
      expect(job).toHaveProperty('title');
      expect(job).toHaveProperty('company');
      expect(Array.isArray(job.skills)).toBe(true);
      expect(Array.isArray(job.requirements)).toBe(true);
      expect(Array.isArray(job.responsibilities)).toBe(true);
      expect(Array.isArray(job.benefits)).toBe(true);

      // Verify matchScore is a valid number, not NaN, between 0 and 100
      expect(typeof job.matchScore).toBe('number');
      expect(Number.isFinite(job.matchScore)).toBe(true);
      expect(Number.isNaN(job.matchScore)).toBe(false);
      expect(job.matchScore).toBeGreaterThanOrEqual(0);
      expect(job.matchScore).toBeLessThanOrEqual(100);
    });

    it('should filter jobs by location', async () => {
      const res = await request(app).get('/api/jobs?location=Bengaluru');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBeGreaterThan(0);
      res.body.jobs.forEach((j: any) => {
        expect(j.location.toLowerCase()).toContain('bengaluru');
      });
    });

    it('should filter jobs by search query q across title or skills', async () => {
      const res = await request(app).get('/api/jobs?q=React');

      expect(res.status).toBe(200);
      expect(res.body.jobs.length).toBeGreaterThan(0);
      res.body.jobs.forEach((j: any) => {
        const matches =
          j.title.toLowerCase().includes('react') ||
          j.skills.some((s: string) => s.toLowerCase().includes('react')) ||
          j.description.toLowerCase().includes('react');
        expect(matches).toBe(true);
      });
    });
  });

  describe('GET /api/jobs/recommended', () => {
    it('should return recommended jobs ordered by match score', async () => {
      const res = await request(app)
        .get('/api/jobs/recommended?limit=4')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.jobs)).toBe(true);
      expect(res.body.jobs.length).toBeLessThanOrEqual(4);

      // Check sorting descending by matchScore
      for (let i = 0; i < res.body.jobs.length - 1; i++) {
        expect(res.body.jobs[i].matchScore).toBeGreaterThanOrEqual(
          res.body.jobs[i + 1].matchScore
        );
      }
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should return single job details by id', async () => {
      const res = await request(app).get(`/api/jobs/${testJobId}`);

      expect(res.status).toBe(200);
      expect(res.body.job).toHaveProperty('id', testJobId);
      expect(Array.isArray(res.body.job.skills)).toBe(true);
    });

    it('should return 404 for non-existent job id', async () => {
      const res = await request(app).get('/api/jobs/non-existent-job-xyz');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job with ID "non-existent-job-xyz" was not found',
        },
      });
    });
  });

  describe('POST & DELETE /api/jobs/:id/save', () => {
    it('should require authentication to save a job', async () => {
      const res = await request(app).post(`/api/jobs/${testJobId}/save`);
      expect(res.status).toBe(401);
      expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should bookmark a job and retrieve it in saved jobs list', async () => {
      // 1. Save job
      const saveRes = await request(app)
        .post(`/api/jobs/${testJobId}/save`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(saveRes.status).toBe(200);
      expect(saveRes.body.saved).toBe(true);

      // 2. Verify in saved list
      const listRes = await request(app)
        .get('/api/jobs/saved')
        .set('Authorization', `Bearer ${authToken}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.savedJobIds).toContain(testJobId);

      // 3. Remove bookmark
      const unsaveRes = await request(app)
        .delete(`/api/jobs/${testJobId}/save`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(unsaveRes.status).toBe(200);
      expect(unsaveRes.body.saved).toBe(false);

      // 4. Verify no longer in saved list
      const afterListRes = await request(app)
        .get('/api/jobs/saved')
        .set('Authorization', `Bearer ${authToken}`);

      expect(afterListRes.body.savedJobIds).not.toContain(testJobId);
    });
  });
});
