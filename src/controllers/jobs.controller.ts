import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { formatJobResponse } from '../utils/jobFormatter.js';

export async function getJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      q,
      searchQuery,
      role,
      location,
      experience,
      experienceLevel,
      type,
      jobType,
      min_salary,
      minSalary,
      minSalaryLpa,
      page = '1',
      limit = '50',
    } = req.query as Record<string, string | undefined>;

    const searchTerm = (q || searchQuery || '').trim().toLowerCase();
    const roleFilter = role && role !== 'All Roles' ? role.trim() : undefined;
    const locationFilter = location && location !== 'All Locations' ? location.trim() : undefined;
    const experienceFilter = (experience || experienceLevel) && (experience || experienceLevel) !== 'All Levels' 
      ? (experience || experienceLevel)!.trim() 
      : undefined;
    const typeFilter = (type || jobType) && (type || jobType) !== 'All Types' ? (type || jobType)!.trim() : undefined;
    const minSalaryValue = Number(min_salary || minSalary || minSalaryLpa);

    // Fetch user profile skills & saved jobs if authenticated
    let userSkills: string[] = [];
    const savedJobIdSet = new Set<string>();

    if (req.user) {
      const [profile, savedJobs] = await Promise.all([
        prisma.profile.findUnique({
          where: { userId: req.user.id },
          select: { skills: true },
        }),
        prisma.savedJob.findMany({
          where: { userId: req.user.id },
          select: { jobId: true },
        }),
      ]);

      if (profile && Array.isArray(profile.skills)) {
        userSkills = profile.skills;
      }
      savedJobs.forEach((s) => savedJobIdSet.add(s.jobId));
    }

    // Build database query filters
    const where: any = {};

    if (roleFilter) {
      where.OR = [
        { category: { equals: roleFilter, mode: 'insensitive' } },
        { title: { contains: roleFilter, mode: 'insensitive' } },
      ];
    }

    if (locationFilter) {
      where.location = { contains: locationFilter, mode: 'insensitive' };
    }

    if (experienceFilter) {
      where.experienceLevel = { equals: experienceFilter };
    }

    if (typeFilter) {
      where.jobType = { equals: typeFilter };
    }

    if (Number.isFinite(minSalaryValue) && minSalaryValue > 0) {
      where.salaryMaxLpa = { gte: minSalaryValue };
    }

    const allJobs = await prisma.job.findMany({
      where,
      orderBy: { postedDate: 'desc' },
    });

    // Format jobs with calculated match scores
    let formattedJobs = allJobs.map((job) =>
      formatJobResponse(job, userSkills, savedJobIdSet)
    );

    // If text query provided, filter across title, company, skills, description
    if (searchTerm) {
      formattedJobs = formattedJobs.filter((job) => {
        if (!job) return false;
        return (
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.skills.some((s) => s.toLowerCase().includes(searchTerm)) ||
          job.description.toLowerCase().includes(searchTerm)
        );
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const total = formattedJobs.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = formattedJobs.slice(startIndex, startIndex + limitNum);

    // If frontend requests without envelope or asks for array
    // Check if frontend or test: if request contains format=array or frontend calls it
    const wantsArray = req.query.format === 'array' || req.query.raw === 'true';

    if (wantsArray) {
      res.json(paginated);
      return;
    }

    res.json({
      jobs: paginated,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendedJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = Math.max(1, parseInt((req.query.limit as string) || '4', 10));

    let userSkills: string[] = [];
    const savedJobIdSet = new Set<string>();

    if (req.user) {
      const [profile, savedJobs] = await Promise.all([
        prisma.profile.findUnique({
          where: { userId: req.user.id },
          select: { skills: true },
        }),
        prisma.savedJob.findMany({
          where: { userId: req.user.id },
          select: { jobId: true },
        }),
      ]);

      if (profile && Array.isArray(profile.skills)) {
        userSkills = profile.skills;
      }
      savedJobs.forEach((s) => savedJobIdSet.add(s.jobId));
    }

    const jobs = await prisma.job.findMany();
    const formatted = jobs
      .map((job) => formatJobResponse(job, userSkills, savedJobIdSet))
      .filter(Boolean)
      .sort((a, b) => b!.matchScore - a!.matchScore)
      .slice(0, limit);

    if (req.query.format === 'array') {
      res.json(formatted);
      return;
    }

    res.json({ jobs: formatted });
  } catch (error) {
    next(error);
  }
}

export async function getSavedJobIds(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    const saved = await prisma.savedJob.findMany({
      where: { userId },
      select: { jobId: true },
    });

    res.json({
      savedJobIds: saved.map((s) => s.jobId),
    });
  } catch (error) {
    next(error);
  }
}

export async function getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundError(`Job with ID "${id}" was not found`, 'JOB_NOT_FOUND');
    }

    let userSkills: string[] = [];
    const savedJobIdSet = new Set<string>();

    if (req.user) {
      const [profile, savedJob] = await Promise.all([
        prisma.profile.findUnique({
          where: { userId: req.user.id },
          select: { skills: true },
        }),
        prisma.savedJob.findUnique({
          where: {
            userId_jobId: {
              userId: req.user.id,
              jobId: id,
            },
          },
        }),
      ]);

      if (profile && Array.isArray(profile.skills)) {
        userSkills = profile.skills;
      }
      if (savedJob) {
        savedJobIdSet.add(id);
      }
    }

    res.json({
      job: formatJobResponse(job, userSkills, savedJobIdSet),
    });
  } catch (error) {
    next(error);
  }
}

export async function saveJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const jobId = req.params.id as string;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundError(`Job with ID "${jobId}" not found`, 'JOB_NOT_FOUND');
    }

    await prisma.savedJob.upsert({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      update: {},
      create: {
        userId,
        jobId,
      },
    });

    res.json({
      saved: true,
      jobId,
      message: 'Job successfully saved to bookmarks',
    });
  } catch (error) {
    next(error);
  }
}

export async function unsaveJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const jobId = req.params.id as string;

    await prisma.savedJob.deleteMany({
      where: {
        userId,
        jobId,
      },
    });

    res.json({
      saved: false,
      jobId,
      message: 'Job removed from bookmarks',
    });
  } catch (error) {
    next(error);
  }
}

export async function createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      title,
      company,
      companyTagline,
      location,
      experienceLevel,
      jobType,
      category,
      salaryMinLpa,
      salaryMaxLpa,
      postedDate,
      skills,
      description,
      requirements,
      responsibilities,
      benefits,
      isFeatured,
    } = req.body;

    const id = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newJob = await prisma.job.create({
      data: {
        id,
        title,
        company,
        companyTagline: companyTagline || null,
        location,
        experienceLevel,
        jobType,
        category,
        salaryMinLpa: Number(salaryMinLpa) || 0,
        salaryMaxLpa: Number(salaryMaxLpa) || 0,
        postedDate: postedDate || new Date().toISOString().split('T')[0],
        skills: Array.isArray(skills) ? skills : [],
        description: description || '',
        requirements: Array.isArray(requirements) ? requirements : [],
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        benefits: Array.isArray(benefits) ? benefits : [],
        isFeatured: Boolean(isFeatured),
      },
    });

    res.status(201).json({
      job: formatJobResponse(newJob),
      message: 'Job created successfully',
    });
  } catch (error) {
    next(error);
  }
}
