import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { formatProfileResponse } from './auth.controller.js';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    headline: z.string().optional(),
    targetRole: z.string().optional(),
    preferredLocations: z.array(z.string()).optional(),
    minSalaryLpa: z.number().min(0).optional(),
    experienceYears: z.number().min(0).optional(),
    skills: z.array(z.string()).optional(),
    resumeText: z.string().optional(),
  }),
});

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found', 'PROFILE_NOT_FOUND');
    }

    res.json({
      profile: formatProfileResponse(profile),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const {
      name,
      phone,
      headline,
      targetRole,
      preferredLocations,
      minSalaryLpa,
      experienceYears,
      skills,
      resumeText,
    } = req.body;

    const existing = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundError('Profile not found', 'PROFILE_NOT_FOUND');
    }

    // Calculate completeness percentage dynamically
    const updatedSkills = skills ?? (Array.isArray(existing.skills) ? existing.skills : []);
    const updatedLocations = preferredLocations ?? (Array.isArray(existing.preferredLocations) ? existing.preferredLocations : []);
    const updatedHeadline = headline !== undefined ? headline : existing.headline;
    const updatedTargetRole = targetRole !== undefined ? targetRole : existing.targetRole;

    let score = 20; // baseline
    if (updatedHeadline && updatedHeadline.trim()) score += 15;
    if (Array.isArray(updatedSkills) && updatedSkills.length >= 4) score += 25;
    if (Array.isArray(updatedLocations) && updatedLocations.length >= 1) score += 15;
    if (updatedTargetRole && updatedTargetRole.trim()) score += 15;
    if (resumeText || existing.resumeText) score += 10;
    const profileCompletenessPercentage = Math.min(100, score);

    const updated = await prisma.profile.update({
      where: { userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(headline !== undefined && { headline }),
        ...(targetRole !== undefined && { targetRole }),
        ...(preferredLocations !== undefined && { preferredLocations }),
        ...(minSalaryLpa !== undefined && { minSalaryLpa }),
        ...(experienceYears !== undefined && { experienceYears }),
        ...(skills !== undefined && { skills }),
        ...(resumeText !== undefined && { resumeText }),
        profileCompletenessPercentage,
      },
    });

    res.json({
      profile: formatProfileResponse(updated),
    });
  } catch (error) {
    next(error);
  }
}
