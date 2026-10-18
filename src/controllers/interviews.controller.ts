import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { INTERVIEW_QUESTIONS } from '../data/interviewQuestions.js';

export const evaluateAnswerSchema = z.object({
  body: z.object({
    questionId: z.string().optional(),
    question: z.string().min(5, 'Question text is required'),
    role: z.string().optional().default('Software Engineering'),
    difficulty: z.string().optional().default('Senior'),
    category: z.string().optional().default('Technical & Behavioral'),
    answer: z.string().min(10, 'Candidate answer must be at least 10 characters long'),
    timeSpentSeconds: z.number().optional().default(0),
  }),
});

interface StarEvaluation {
  overallScore: number;
  starScores: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    sampleBetterAnswer: string;
  };
  keyConceptsIdentified: string[];
}

function evaluateWithHeuristics(question: string, answer: string): StarEvaluation {
  const answerLower = answer.toLowerCase();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  const hasSituation = answerLower.includes('when') || answerLower.includes('at my') || answerLower.includes('in our') || answerLower.includes('project');
  const hasTask = answerLower.includes('goal') || answerLower.includes('needed to') || answerLower.includes('objective') || answerLower.includes('challenge');
  const hasAction = answerLower.includes('i ') || answerLower.includes('implemented') || answerLower.includes('designed') || answerLower.includes('created') || answerLower.includes('refactored');
  const hasResult = answerLower.includes('result') || answerLower.includes('improved') || answerLower.includes('reduced') || answerLower.includes('increased') || /\b\d+(%|x|ms|s)?\b/.test(answer);

  const situationScore = Math.min(95, Math.max(60, 65 + (hasSituation ? 20 : 5) + (wordCount > 40 ? 10 : 0)));
  const taskScore = Math.min(95, Math.max(60, 65 + (hasTask ? 20 : 5) + (wordCount > 60 ? 10 : 0)));
  const actionScore = Math.min(95, Math.max(65, 70 + (hasAction ? 20 : 5) + (wordCount > 80 ? 5 : 0)));
  const resultScore = Math.min(98, Math.max(55, 60 + (hasResult ? 30 : 5)));

  const overallScore = Math.round((situationScore + taskScore + actionScore + resultScore) / 4);

  return {
    overallScore,
    starScores: {
      situation: situationScore,
      task: taskScore,
      action: actionScore,
      result: resultScore,
    },
    feedback: {
      strengths: [
        'Direct and relevant response addressing the core problem stated in the question.',
        hasAction ? 'Good focus on personal engineering actions, technical choices, and trade-offs.' : 'Clear technical context described.',
        hasResult ? 'Included quantifiable outcomes and measured business or engineering metrics.' : 'Logical progression of thoughts.'
      ],
      improvements: [
        !hasResult ? 'Explicitly state the measurable Result (e.g. latency reduction by 40%, zero downtime migration).' : 'Elaborate on how you handled edge cases or unexpected obstacles.',
        'Use the STAR framework explicitly to give interviewers an easy-to-follow narrative.',
      ],
      sampleBetterAnswer: `In my previous role (Situation), we faced significant latency spikes during peak workloads. My goal was to maintain P99 latencies below 100ms (Task). I identified bottlenecks using profiling tools, decoupled synchronous tasks with an async message queue, and added Redis caching with optimal TTLs (Action). As a result, our P99 dropped by 65% and system reliability reached 99.99% without increasing infrastructure spend (Result).`
    },
    keyConceptsIdentified: ['STAR Methodology', 'System Reliability', 'Measurable Engineering Impact']
  };
}

export async function getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role, category } = req.query as { role?: string; category?: string };

    let questions = INTERVIEW_QUESTIONS;

    if (role && role !== 'All') {
      questions = questions.filter(
        (q) => q.role.toLowerCase() === role.toLowerCase() || q.role.toLowerCase().includes(role.toLowerCase())
      );
    }

    if (category && category !== 'All') {
      questions = questions.filter(
        (q) => q.category.toLowerCase() === category.toLowerCase() || q.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    res.json({
      questions: questions.length > 0 ? questions : INTERVIEW_QUESTIONS,
      total: questions.length > 0 ? questions.length : INTERVIEW_QUESTIONS.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function evaluateAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { questionId, question, role, difficulty, category, answer, timeSpentSeconds } = req.body;

    let evaluation: StarEvaluation;

    if (env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.trim() !== '') {
      try {
        const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
        const prompt = `You are a Principal Tech Bar-Raiser evaluating a candidate's answer for a ${role} interview.
Evaluate the candidate's answer using the STAR method (Situation, Task, Action, Result).
Respond ONLY with a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "starScores": {
    "situation": number (0-100),
    "task": number (0-100),
    "action": number (0-100),
    "result": number (0-100)
  },
  "feedback": {
    "strengths": string[],
    "improvements": string[],
    "sampleBetterAnswer": string
  },
  "keyConceptsIdentified": string[]
}

Question:
${question}

Candidate Answer:
${answer}`;

        const aiRes = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }],
        });

        const block = aiRes.content[0];
        if (block && block.type === 'text') {
          let raw = block.text.trim();
          if (raw.startsWith('```json')) raw = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
          else if (raw.startsWith('```')) raw = raw.replace(/^```\s*/, '').replace(/\s*```$/, '');
          evaluation = JSON.parse(raw);
        } else {
          evaluation = evaluateWithHeuristics(question, answer);
        }
      } catch {
        evaluation = evaluateWithHeuristics(question, answer);
      }
    } else {
      evaluation = evaluateWithHeuristics(question, answer);
    }

    // Save to user session if logged in
    if (req.user) {
      try {
        await prisma.interviewSession.create({
          data: {
            userId: req.user.id,
            questionId: questionId || 'custom-q',
            question,
            role: role || 'Engineering',
            difficulty: difficulty || 'Senior',
            category: category || 'General',
            userAnswer: answer,
            timeSpentSeconds: timeSpentSeconds || 0,
            feedback: evaluation as any,
          },
        });
      } catch (dbErr) {
        console.warn('Could not persist interview evaluation:', (dbErr as Error).message);
      }
    }

    res.json({
      id: `eval-${Date.now()}`,
      evaluatedAt: new Date().toISOString(),
      question,
      userAnswer: answer,
      evaluation,
    });
  } catch (error) {
    next(error);
  }
}
