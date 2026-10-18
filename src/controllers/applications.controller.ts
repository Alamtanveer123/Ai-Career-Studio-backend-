import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { calculateMatchScore } from '../services/matchScore.service.js';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'jobId is required'),
    stage: z.enum(['saved', 'applied', 'interview', 'offer', 'rejected']).optional().default('applied'),
    notes: z.string().optional(),
    interviewDate: z.string().optional(),
    contactPerson: z.string().optional(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    stage: z.enum(['saved', 'applied', 'interview', 'offer', 'rejected']).optional(),
    notes: z.string().optional(),
    interviewDate: z.string().nullable().optional(),
    contactPerson: z.string().optional(),
  }),
});

function formatApplicationResponse(app: any) {
  const job = app.job;
  const salaryText = job
    ? `₹${job.salaryMinLpa || 0} - ₹${job.salaryMaxLpa || 0} LPA`
    : 'Not specified';

  return {
    id: app.id,
    userId: app.userId,
    jobId: app.jobId,
    jobTitle: job?.title || 'Unknown Role',
    company: job?.company || 'Unknown Company',
    location: job?.location || 'India',
    salaryText,
    stage: app.stage,
    dateAdded: app.createdAt ? app.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: app.updatedAt ? app.updatedAt.toISOString() : new Date().toISOString(),
    notes: app.notes || undefined,
    interviewDate: app.interviewDate ? app.interviewDate.toISOString() : undefined,
    matchScore: app.matchScore || 0,
    contactPerson: app.contactPerson || undefined,
    job: job
      ? {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          category: job.category,
          salaryMinLpa: job.salaryMinLpa,
          salaryMaxLpa: job.salaryMaxLpa,
        }
      : undefined,
  };
}

export async function getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      applications: applications.map(formatApplicationResponse),
      total: applications.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const { jobId, stage = 'applied', notes, interviewDate } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundError(`Job with ID "${jobId}" not found`, 'JOB_NOT_FOUND');
    }

    // Calculate match score based on user profile skills
    let matchScore = 0;
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { skills: true },
    });

    if (profile && Array.isArray(profile.skills)) {
      matchScore = calculateMatchScore(job.skills || [], profile.skills);
    }

    // Upsert so applying again updates or re-tracks without error
    const application = await prisma.application.upsert({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      update: {
        stage,
        ...(notes !== undefined && { notes }),
        ...(interviewDate !== undefined && {
          interviewDate: interviewDate ? new Date(interviewDate) : null,
        }),
        matchScore,
      },
      create: {
        userId,
        jobId,
        stage,
        notes: notes || null,
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        matchScore,
      },
      include: {
        job: true,
      },
    });

    res.status(201).json({
      application: formatApplicationResponse(application),
      message: 'Application tracked successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const { stage, notes, interviewDate } = req.body;

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundError(`Application with ID "${id}" not found`, 'APPLICATION_NOT_FOUND');
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(stage !== undefined && { stage }),
        ...(notes !== undefined && { notes }),
        ...(interviewDate !== undefined && {
          interviewDate: interviewDate ? new Date(interviewDate) : null,
        }),
      },
      include: {
        job: true,
      },
    });

    res.json({
      application: formatApplicationResponse(updated),
      message: 'Application updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundError(`Application with ID "${id}" not found`, 'APPLICATION_NOT_FOUND');
    }

    await prisma.application.delete({
      where: { id },
    });

    res.json({
      success: true,
      id,
      message: 'Application removed from pipeline',
    });
  } catch (error) {
    next(error);
  }
}
