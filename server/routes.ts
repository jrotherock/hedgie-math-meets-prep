import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { problemGenerator } from "./problemGenerator";
import { insertProblemSchema, insertPracticeSessionSchema, insertProblemAttemptSchema } from "@shared/schema";
import { z } from "zod";

// Request validation schemas
const generateProblemSchema = z.object({
  roundType: z.enum(['sprint', 'target', 'numbersense', 'team']),
  difficulty: z.number().min(1).max(5),
  topics: z.array(z.string()).optional(),
  gradeLevel: z.number().min(3).max(6).optional(),
  count: z.number().min(1).max(10).optional()
});

const createPracticeSessionSchema = z.object({
  studentId: z.string(),
  roundType: z.enum(['sprint', 'target', 'numbersense', 'team']),
  totalQuestions: z.number().min(1),
  settings: z.object({}).optional()
});

const submitAnswerSchema = z.object({
  sessionId: z.string(),
  problemId: z.string(),
  studentAnswer: z.string(),
  timeSpent: z.number().optional(),
  hintsUsed: z.number().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Problem generation routes
  app.post('/api/problems/generate', async (req, res) => {
    try {
      const { roundType, difficulty, topics, gradeLevel, count } = generateProblemSchema.parse(req.body);
      
      if (count && count > 1) {
        // Generate multiple problems
        const problems = await problemGenerator.generateMultipleProblems({
          roundType, difficulty, topics, gradeLevel
        }, count);
        
        // Save generated problems to database
        const savedProblems = [];
        for (const problem of problems) {
          const insertData = problemGenerator.convertToInsertProblem(problem, roundType);
          const saved = await storage.createProblem(insertData);
          savedProblems.push({ ...saved, explanation: problem.explanation });
        }
        
        res.json({ problems: savedProblems });
      } else {
        // Generate single problem
        const problem = await problemGenerator.generateProblem({
          roundType, difficulty, topics, gradeLevel
        });
        
        // Save to database
        const insertData = problemGenerator.convertToInsertProblem(problem, roundType);
        const savedProblem = await storage.createProblem(insertData);
        
        res.json({ 
          problem: { ...savedProblem, explanation: problem.explanation } 
        });
      }
    } catch (error) {
      console.error('Problem generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate problem', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Get existing problems
  app.get('/api/problems', async (req, res) => {
    try {
      const { type, limit } = req.query;
      const problems = await storage.getProblems(
        type as 'sprint' | 'target' | 'numbersense' | 'team' | undefined, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json({ problems });
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      res.status(500).json({ error: 'Failed to fetch problems' });
    }
  });

  // Get specific problem
  app.get('/api/problems/:id', async (req, res) => {
    try {
      const problem = await storage.getProblem(req.params.id);
      if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
      }
      res.json({ problem });
    } catch (error) {
      console.error('Failed to fetch problem:', error);
      res.status(500).json({ error: 'Failed to fetch problem' });
    }
  });

  // Practice session routes
  app.post('/api/practice-sessions', async (req, res) => {
    try {
      const sessionData = createPracticeSessionSchema.parse(req.body);
      const session = await storage.createPracticeSession(sessionData);
      res.json({ session });
    } catch (error) {
      console.error('Failed to create practice session:', error);
      res.status(500).json({ error: 'Failed to create practice session' });
    }
  });

  // Submit answer for practice session
  app.post('/api/practice-sessions/submit-answer', async (req, res) => {
    try {
      const { sessionId, problemId, studentAnswer, timeSpent, hintsUsed } = submitAnswerSchema.parse(req.body);
      
      // Get the correct answer
      const problem = await storage.getProblem(problemId);
      if (!problem) {
        return res.status(404).json({ error: 'Problem not found' });
      }
      
      // Check if answer is correct (normalize for comparison)
      const normalizedStudentAnswer = studentAnswer.trim().toLowerCase();
      const normalizedCorrectAnswer = problem.answer.trim().toLowerCase();
      const isCorrect = normalizedStudentAnswer === normalizedCorrectAnswer;
      
      // Create problem attempt record
      const attempt = await storage.createProblemAttempt({
        sessionId,
        problemId,
        studentAnswer,
        isCorrect,
        timeSpent: timeSpent || 0,
        hintsUsed: hintsUsed || 0
      });
      
      // Update session stats if answer is correct
      if (isCorrect) {
        const session = await storage.getPracticeSession(sessionId);
        if (session) {
          await storage.updatePracticeSession(sessionId, {
            correctAnswers: session.correctAnswers + 1
          });
        }
      }
      
      res.json({ 
        attempt, 
        isCorrect, 
        correctAnswer: problem.answer 
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
      res.status(500).json({ error: 'Failed to submit answer' });
    }
  });

  // Complete practice session
  app.post('/api/practice-sessions/:id/complete', async (req, res) => {
    try {
      const { score, timeSpent } = req.body;
      
      const session = await storage.updatePracticeSession(req.params.id, {
        completedAt: new Date(),
        score: score || 0,
        timeSpent: timeSpent || 0
      });
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json({ session });
    } catch (error) {
      console.error('Failed to complete session:', error);
      res.status(500).json({ error: 'Failed to complete session' });
    }
  });

  // Get student's practice history
  app.get('/api/students/:studentId/sessions', async (req, res) => {
    try {
      const { limit } = req.query;
      const sessions = await storage.getStudentSessions(
        req.params.studentId,
        limit ? parseInt(limit as string) : undefined
      );
      res.json({ sessions });
    } catch (error) {
      console.error('Failed to fetch student sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  // Student management routes (for demo - in real app would be behind auth)
  app.post('/api/students', async (req, res) => {
    try {
      // For demo, using a default user ID
      const studentData = {
        ...req.body,
        userId: 'demo-user' // In real app, get from authenticated user
      };
      const student = await storage.createStudent(studentData);
      res.json({ student });
    } catch (error) {
      console.error('Failed to create student:', error);
      res.status(500).json({ error: 'Failed to create student' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      message: 'Hedgie Math League Prep API is running!' 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
