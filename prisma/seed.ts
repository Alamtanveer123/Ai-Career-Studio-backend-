import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SAMPLE_JOBS } from './sampleJobs.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MongoDB database seed...');

  // 1. Seed Jobs
  console.log(`💼 Seeding ${SAMPLE_JOBS.length} jobs into MongoDB Atlas...`);
  for (const job of SAMPLE_JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        title: job.title,
        company: job.company,
        companyTagline: job.companyTagline ?? null,
        location: job.location,
        experienceLevel: job.experienceLevel,
        jobType: job.jobType,
        category: job.category,
        salaryMinLpa: job.salaryMinLpa,
        salaryMaxLpa: job.salaryMaxLpa,
        postedDate: job.postedDate,
        skills: job.skills || [],
        description: job.description,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        benefits: job.benefits || [],
        isFeatured: Boolean(job.isFeatured),
      },
      create: {
        id: job.id,
        title: job.title,
        company: job.company,
        companyTagline: job.companyTagline ?? null,
        location: job.location,
        experienceLevel: job.experienceLevel,
        jobType: job.jobType,
        category: job.category,
        salaryMinLpa: job.salaryMinLpa,
        salaryMaxLpa: job.salaryMaxLpa,
        postedDate: job.postedDate,
        skills: job.skills || [],
        description: job.description,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        benefits: job.benefits || [],
        isFeatured: Boolean(job.isFeatured),
      },
    });
  }

  // 2. Seed Demo User
  console.log('👤 Seeding default demo user (tanveer.alam@example.com / Password123!)...');
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'tanveer.alam@example.com' },
    update: {
      passwordHash,
    },
    create: {
      email: 'tanveer.alam@example.com',
      passwordHash,
    },
  });

  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {
      name: 'Tanveer Alam',
      phone: '+91 98765 43210',
      headline: 'Senior Frontend & AI Solutions Engineer | React, TypeScript, System Architecture',
      targetRole: 'Senior Frontend Engineer',
      preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote (India)'],
      minSalaryLpa: 25,
      experienceYears: 5,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'State Management', 'REST APIs', 'Node.js', 'System Design'],
      profileCompletenessPercentage: 85,
    },
    create: {
      userId: demoUser.id,
      name: 'Tanveer Alam',
      phone: '+91 98765 43210',
      headline: 'Senior Frontend & AI Solutions Engineer | React, TypeScript, System Architecture',
      targetRole: 'Senior Frontend Engineer',
      preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote (India)'],
      minSalaryLpa: 25,
      experienceYears: 5,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'State Management', 'REST APIs', 'Node.js', 'System Design'],
      profileCompletenessPercentage: 85,
    },
  });

  // 3. Seed Saved Jobs for Demo User
  console.log('🔖 Seeding saved jobs...');
  const savedJobIds = ['job-1', 'job-2', 'job-4'];
  for (const jobId of savedJobIds) {
    await prisma.savedJob.upsert({
      where: {
        userId_jobId: {
          userId: demoUser.id,
          jobId,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        jobId,
      },
    });
  }

  // 4. Seed Applications for Demo User
  console.log('📋 Seeding demo applications for Kanban tracker...');
  const sampleApps = [
    {
      jobId: 'job-1',
      stage: 'interview',
      notes: 'Technical round scheduled with Engineering Lead. Focus on React 19 and WebSockets.',
      interviewDate: new Date('2026-10-18T14:00:00.000Z'),
      matchScore: 96,
    },
    {
      jobId: 'job-2',
      stage: 'applied',
      notes: 'Submitted via company copilot tracker.',
      matchScore: 92,
    },
    {
      jobId: 'job-4',
      stage: 'saved',
      notes: 'Reviewing team tech stack and recent robotics launches.',
      matchScore: 87,
    },
    {
      jobId: 'job-3',
      stage: 'offer',
      notes: 'Offer letter received! Base ₹36L + ₹6L retention bonus + ESOPs.',
      matchScore: 89,
    },
  ];

  for (const app of sampleApps) {
    await prisma.application.upsert({
      where: {
        userId_jobId: {
          userId: demoUser.id,
          jobId: app.jobId,
        },
      },
      update: {
        stage: app.stage,
        notes: app.notes,
        interviewDate: app.interviewDate ?? null,
        matchScore: app.matchScore,
      },
      create: {
        userId: demoUser.id,
        jobId: app.jobId,
        stage: app.stage,
        notes: app.notes,
        interviewDate: app.interviewDate ?? null,
        matchScore: app.matchScore,
      },
    });
  }

  console.log('✅ MongoDB database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
