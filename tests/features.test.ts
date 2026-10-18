import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Express } from 'express';

describe('Applications, Resume Analysis, Interviews & Health Endpoints', () => {
  let app: Express;
  let authToken: string;
  let sampleJobId: string;
  let createdAppId: string;

  beforeAll(async () => {
    app = createApp();

    // Log in with seeded demo user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'tanveer.alam@example.com',
        password: 'Password123!',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user).toBeDefined();
    expect(loginRes.body.user.name).toBeDefined();
    expect(loginRes.body.user.email).toBe('tanveer.alam@example.com');
    authToken = loginRes.body.token;

    // Fetch sample job ID
    const jobsRes = await request(app).get('/api/jobs');
    expect(jobsRes.status).toBe(200);
    if (jobsRes.body.jobs.length > 0) {
      sampleJobId = jobsRes.body.jobs[0].id;
    }
  });

  describe('GET /api/health and /health', () => {
    it('should return health status ok from /api/health', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return health status ok from /health', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('Kanban Applications Pipeline', () => {
    it('should track a job application or update stage', async () => {
      if (!sampleJobId) return;

      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          jobId: sampleJobId,
          stage: 'applied',
          notes: 'Submitted customized resume and portfolio via referral.',
        });

      expect(res.status).toBe(201);
      expect(res.body.application).toBeDefined();
      expect(res.body.application.jobId).toBe(sampleJobId);
      expect(res.body.application.stage).toBe('applied');
      expect(res.body.application.salaryText).toBeDefined();
      createdAppId = res.body.application.id;
    });

    it('should list tracked applications for current user', async () => {
      const res = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.applications)).toBe(true);
      expect(res.body.total).toBeGreaterThanOrEqual(1);
    });

    it('should update stage (dragged across columns in Kanban)', async () => {
      if (!createdAppId) return;

      const res = await request(app)
        .put(`/api/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          stage: 'interview',
          notes: 'Technical screen scheduled for Thursday 3 PM.',
          interviewDate: '2026-10-24T15:00:00Z',
        });

      expect(res.status).toBe(200);
      expect(res.body.application.stage).toBe('interview');
      expect(res.body.application.notes).toContain('Technical screen');
    });

    it('should delete tracked application', async () => {
      if (!createdAppId) return;

      const res = await request(app)
        .delete(`/api/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/resume/analyze', () => {
    it('should analyze resume text and return structured ResumeAnalysis output matching frontend spec', async () => {
      const sampleResume = `
Tanveer Alam
Senior Full Stack Engineer
Bangalore, India | tanveer@example.com

Summary:
Full stack engineer with 6+ years of experience architecting large scale distributed web applications.
Proficient in React, Next.js, TypeScript, Node.js, Express, PostgreSQL, and Redis.
Spearheaded migration to microservices improving response times by 40% and saving $12,000 monthly.

Experience:
Senior Software Engineer at FinTech Corp (2023 - Present)
- Engineered real-time fraud detection pipeline processing 25,000 transactions per second.
- Reduced database P99 latency from 450ms to 48ms with Redis caching and query indexing.
- Led frontend design system migration to Tailwind CSS with 99.8% test coverage.

Skills:
React, TypeScript, Node.js, PostgreSQL, Docker, Redis, REST APIs, Git, System Design.
`;

      const res = await request(app)
        .post('/api/resume/analyze')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          resumeText: sampleResume,
          fileName: 'tanveer-resume.pdf',
        });

      expect(res.status).toBe(200);
      const data = res.body;

      expect(data.id).toBeDefined();
      expect(data.analyzedAt).toBeDefined();
      expect(data.fileName).toBe('tanveer-resume.pdf');
      expect(typeof data.overallScore).toBe('number');
      expect(data.sectionScores).toBeDefined();
      expect(typeof data.sectionScores.impact).toBe('number');
      expect(typeof data.sectionScores.skills).toBe('number');
      expect(typeof data.sectionScores.formatting).toBe('number');
      expect(typeof data.sectionScores.experience).toBe('number');
      expect(Array.isArray(data.strengths)).toBe(true);
      expect(Array.isArray(data.weaknesses)).toBe(true);
      expect(Array.isArray(data.suggestions)).toBe(true);
      expect(Array.isArray(data.missingSkills)).toBe(true);
      expect(Array.isArray(data.matchedSkills)).toBe(true);
      expect(data.extractedWordCount).toBeGreaterThan(50);
      expect(data.detectedRoleTarget).toBeDefined();
    });

    it('should reject empty resume submission with 400', async () => {
      const res = await request(app)
        .post('/api/resume/analyze')
        .send({ resumeText: 'Too short' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('Mock Interview System', () => {
    it('should fetch category-based interview questions', async () => {
      const res = await request(app).get('/api/interviews/questions?role=Frontend');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.questions)).toBe(true);
      expect(res.body.questions.length).toBeGreaterThan(0);
    });

    it('should evaluate answer using STAR methodology', async () => {
      const res = await request(app)
        .post('/api/interviews/evaluate')
        .send({
          question: 'How do you handle high database load in peak hours?',
          role: 'Backend Engineering',
          answer: 'At my previous company, our database was experiencing 95% CPU utilization during flash sales. I investigated with slow query logs and identified missing composite indexes. I implemented Redis caching with sliding window TTLs and added a read replica for analytics queries. As a result, database CPU dropped to 38% and P99 latency improved by 60%.',
        });

      expect(res.status).toBe(200);
      expect(res.body.evaluation).toBeDefined();
      expect(res.body.evaluation.starScores).toBeDefined();
      expect(res.body.evaluation.starScores.situation).toBeGreaterThan(0);
      expect(res.body.evaluation.starScores.action).toBeGreaterThan(0);
      expect(res.body.evaluation.starScores.result).toBeGreaterThan(0);
      expect(res.body.evaluation.feedback.strengths.length).toBeGreaterThan(0);
      expect(res.body.evaluation.feedback.sampleBetterAnswer).toBeDefined();
    });
  });
});
