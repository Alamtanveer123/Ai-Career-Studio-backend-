import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.js';
import { safeJsonParse } from '../utils/json.js';

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long').trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export function formatProfileResponse(profile: any) {
  if (!profile) return null;
  return {
    ...profile,
    preferredLocations: Array.isArray(profile.preferredLocations)
      ? profile.preferredLocations
      : safeJsonParse<string[]>(profile.preferredLocations, []),
    skills: Array.isArray(profile.skills)
      ? profile.skills
      : safeJsonParse<string[]>(profile.skills, []),
  };
}

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists', 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    const profile = await prisma.profile.create({
      data: {
        userId: newUser.id,
        name,
        headline: 'Full Stack & AI Engineer',
        targetRole: 'Full Stack Engineer',
        preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote (India)'],
        skills: ['React', 'TypeScript', 'Node.js', 'REST APIs'],
        profileCompletenessPercentage: 60,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const formattedUser = {
      id: newUser.id,
      name: profile.name,
      email: newUser.email,
      title: profile.targetRole || profile.headline || 'Full Stack Engineer',
      location: (profile.preferredLocations && profile.preferredLocations[0]) || 'Bengaluru',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      token,
      user: formattedUser,
      profile: formatProfileResponse(profile),
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const formattedUser = {
      id: user.id,
      name: user.profile?.name || user.email.split('@')[0],
      email: user.email,
      title: user.profile?.targetRole || user.profile?.headline || 'Full Stack Engineer',
      location: (user.profile?.preferredLocations && user.profile.preferredLocations[0]) || 'Bengaluru',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.profile?.name || user.email)}`,
      createdAt: user.createdAt,
    };

    res.json({
      token,
      user: formattedUser,
      profile: formatProfileResponse(user.profile),
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const formattedUser = {
      id: user.id,
      name: user.profile?.name || user.email.split('@')[0],
      email: user.email,
      title: user.profile?.targetRole || user.profile?.headline || 'Full Stack Engineer',
      location: (user.profile?.preferredLocations && user.profile.preferredLocations[0]) || 'Bengaluru',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.profile?.name || user.email)}`,
      createdAt: user.createdAt,
    };

    res.json({
      user: formattedUser,
      profile: formatProfileResponse(user.profile),
    });
  } catch (error) {
    next(error);
  }
}
