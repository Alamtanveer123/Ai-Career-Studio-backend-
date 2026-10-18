import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { prisma } from '../config/prisma.js';
import { BadRequestError } from '../utils/errors.js';
import { analyzeResumeWithAI } from '../services/resumeAnalyzer.service.js';

// Setup multer for memory storage up to 5MB
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|doc|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only PDF, DOCX, and TXT files are supported'));
    }
  },
});

export async function analyzeResume(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let resumeText = '';
    let fileName = 'resume.pdf';

    // 1. Check if file uploaded via multipart/form-data
    if (req.file) {
      fileName = req.file.originalname;
      const buffer = req.file.buffer;

      if (fileName.toLowerCase().endsWith('.pdf') || req.file.mimetype === 'application/pdf') {
        const parsed = await pdfParse(buffer);
        resumeText = parsed.text;
      } else if (
        fileName.toLowerCase().endsWith('.docx') ||
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;
      } else {
        resumeText = buffer.toString('utf-8');
      }
    } else if (req.body && typeof req.body.resumeText === 'string') {
      // 2. Direct JSON payload: { resumeText, fileName }
      resumeText = req.body.resumeText;
      if (req.body.fileName) {
        fileName = req.body.fileName;
      }
    }

    resumeText = (resumeText || '').trim();

    if (!resumeText || resumeText.length < 30) {
      throw new BadRequestError(
        'Resume content could not be read or is too short. Please provide a valid resume text or document.'
      );
    }

    // Run AI / Heuristic Analysis
    const analysis = await analyzeResumeWithAI(resumeText, fileName);

    // If user is authenticated, save record to database & update profile skills
    if (req.user) {
      try {
        await prisma.resumeAnalysis.create({
          data: {
            userId: req.user.id,
            fileName: analysis.fileName,
            overallScore: analysis.overallScore,
            sectionScores: analysis.sectionScores,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions,
            missingSkills: analysis.missingSkills,
            matchedSkills: analysis.matchedSkills,
            extractedWordCount: analysis.extractedWordCount,
            detectedRoleTarget: analysis.detectedRoleTarget,
          },
        });

        // Update profile resume text and upload timestamp
        await prisma.profile.update({
          where: { userId: req.user.id },
          data: {
            resumeText: resumeText.slice(0, 10000),
            lastResumeUploadDate: new Date(),
          },
        });
      } catch (dbErr) {
        console.warn('Could not persist resume analysis to DB:', (dbErr as Error).message);
      }
    }

    res.json(analysis);
  } catch (error) {
    next(error);
  }
}
