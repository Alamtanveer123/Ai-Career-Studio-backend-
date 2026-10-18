import { safeJsonParse } from './json.js';
import { calculateMatchScore } from '../services/matchScore.service.js';

export function formatJobResponse(
  job: any,
  userSkills?: string[],
  savedJobIdSet?: Set<string>
) {
  if (!job) return null;

  const skills: string[] = Array.isArray(job.skills)
    ? job.skills
    : safeJsonParse<string[]>(job.skills, []);

  const requirements: string[] = Array.isArray(job.requirements)
    ? job.requirements
    : safeJsonParse<string[]>(job.requirements, []);

  const responsibilities: string[] = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : safeJsonParse<string[]>(job.responsibilities, []);

  const benefits: string[] = Array.isArray(job.benefits)
    ? job.benefits
    : safeJsonParse<string[]>(job.benefits, []);

  const matchScore = calculateMatchScore(skills, userSkills);

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    companyTagline: job.companyTagline ?? undefined,
    location: job.location,
    experienceLevel: job.experienceLevel,
    jobType: job.jobType,
    category: job.category,
    salaryMinLpa: Number(job.salaryMinLpa) || 0,
    salaryMaxLpa: Number(job.salaryMaxLpa) || 0,
    postedDate: job.postedDate,
    skills,
    description: job.description,
    requirements,
    responsibilities,
    benefits,
    matchScore,
    isFeatured: Boolean(job.isFeatured),
    isSaved: savedJobIdSet ? savedJobIdSet.has(job.id) : undefined,
  };
}
