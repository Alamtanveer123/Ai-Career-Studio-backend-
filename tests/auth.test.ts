import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/prisma.js';

describe('Auth & Profile Endpoints', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'SecurePassword123!',
    name: 'Test Candidate',
  };

  let authToken = '';

  afterAll(async () => {
    // Cleanup created test user
    try {
      const user = await prisma.user.findUnique({ where: { email: testUser.email } });
      if (user) {
        await prisma.user.delete({ where: { id: user.id } });
      }
    } catch {
      // ignore cleanup errors
    }
    await prisma.$disconnect();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user and return token, user, and profile with real arrays', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.profile).toBeDefined();
      expect(Array.isArray(res.body.profile.preferredLocations)).toBe(true);
      expect(Array.isArray(res.body.profile.skills)).toBe(true);

      authToken = res.body.token;
    });

    it('should return 409 Conflict if email is already registered', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
      });
    });

    it('should return 400 Validation Error if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'short@example.com',
          password: '123',
          name: 'Short Pass',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testUser.email);
      expect(Array.isArray(res.body.profile.skills)).toBe(true);
    });

    it('should fail with 401 on incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current authenticated user and profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.profile.name).toBe(testUser.name);
    });

    it('should reject request without Bearer token with 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
    });
  });

  describe('GET & PUT /api/profile', () => {
    it('should update profile and recompute completeness score', async () => {
      const res = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          headline: 'Lead Cloud Architect',
          skills: ['Go', 'Kubernetes', 'Docker', 'AWS', 'PostgreSQL'],
          preferredLocations: ['Bengaluru', 'Remote (India)'],
          targetRole: 'Staff Infrastructure Engineer',
        });

      expect(res.status).toBe(200);
      expect(res.body.profile.headline).toBe('Lead Cloud Architect');
      expect(res.body.profile.skills).toEqual(['Go', 'Kubernetes', 'Docker', 'AWS', 'PostgreSQL']);
      expect(res.body.profile.profileCompletenessPercentage).toBeGreaterThanOrEqual(80);
    });

    it('should fetch the updated profile via GET /api/profile', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.profile.headline).toBe('Lead Cloud Architect');
      expect(Array.isArray(res.body.profile.skills)).toBe(true);
      expect(Array.isArray(res.body.profile.preferredLocations)).toBe(true);
    });
  });
});
