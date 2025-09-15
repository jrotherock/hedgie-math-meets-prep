import { 
  users, students, problems, practiceSessions, problemAttempts, studentGoals,
  type User, type InsertUser, type Student, type InsertStudent,
  type Problem, type InsertProblem, type PracticeSession, type InsertPracticeSession,
  type ProblemAttempt, type InsertProblemAttempt, type StudentGoal, type InsertStudentGoal
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Updated interface with Math League CRUD methods
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Students
  createStudent(student: InsertStudent): Promise<Student>;
  getStudent(id: string, userId: string): Promise<Student | undefined>;
  getStudentsByUser(userId: string): Promise<Student[]>;
  
  // Problems
  createProblem(problem: InsertProblem): Promise<Problem>;
  getProblems(type?: 'sprint' | 'target' | 'numbersense' | 'team', limit?: number): Promise<Problem[]>;
  getProblem(id: string): Promise<Problem | undefined>;
  
  // Practice Sessions
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  updatePracticeSession(id: string, userId: string, updates: Partial<PracticeSession>): Promise<PracticeSession | undefined>;
  getPracticeSession(id: string, userId: string): Promise<PracticeSession | undefined>;
  getStudentSessions(studentId: string, userId: string, limit?: number): Promise<PracticeSession[]>;
  
  // Problem Attempts
  createProblemAttempt(attempt: InsertProblemAttempt): Promise<ProblemAttempt>;
  getSessionAttempts(sessionId: string): Promise<ProblemAttempt[]>;
  
  // Student Goals
  createStudentGoal(goal: InsertStudentGoal): Promise<StudentGoal>;
  updateStudentGoal(id: string, userId: string, updates: Partial<StudentGoal>): Promise<StudentGoal | undefined>;
  getStudentGoals(studentId: string, userId: string): Promise<StudentGoal[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Students
  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(students)
      .values(insertStudent)
      .returning();
    return student;
  }
  
  async getStudent(id: string, userId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(
      and(eq(students.id, id), eq(students.userId, userId))
    );
    return student || undefined;
  }
  
  async getStudentsByUser(userId: string): Promise<Student[]> {
    return await db.select().from(students).where(eq(students.userId, userId));
  }
  
  // Problems
  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const [problem] = await db
      .insert(problems)
      .values(insertProblem)
      .returning();
    return problem;
  }
  
  async getProblems(type?: 'sprint' | 'target' | 'numbersense' | 'team', limit = 50): Promise<Problem[]> {
    if (type) {
      return await db.select().from(problems).where(eq(problems.type, type)).limit(limit);
    }
    return await db.select().from(problems).limit(limit);
  }
  
  async getProblem(id: string): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem || undefined;
  }
  
  // Practice Sessions
  async createPracticeSession(insertSession: InsertPracticeSession): Promise<PracticeSession> {
    const [session] = await db
      .insert(practiceSessions)
      .values(insertSession)
      .returning();
    return session;
  }
  
  async updatePracticeSession(id: string, userId: string, updates: Partial<PracticeSession>): Promise<PracticeSession | undefined> {
    // First check if session belongs to user
    const session = await this.getPracticeSession(id, userId);
    if (!session) return undefined;
    
    const [updatedSession] = await db
      .update(practiceSessions)
      .set(updates)
      .where(eq(practiceSessions.id, id))
      .returning();
    return updatedSession || undefined;
  }
  
  async getPracticeSession(id: string, userId: string): Promise<PracticeSession | undefined> {
    const [session] = await db
      .select()
      .from(practiceSessions)
      .innerJoin(students, eq(practiceSessions.studentId, students.id))
      .where(
        and(
          eq(practiceSessions.id, id),
          eq(students.userId, userId)
        )
      );
    return session?.practice_sessions || undefined;
  }
  
  async getStudentSessions(studentId: string, userId: string, limit = 20): Promise<PracticeSession[]> {
    const sessions = await db
      .select()
      .from(practiceSessions)
      .innerJoin(students, eq(practiceSessions.studentId, students.id))
      .where(
        and(
          eq(practiceSessions.studentId, studentId),
          eq(students.userId, userId)
        )
      )
      .orderBy(desc(practiceSessions.startedAt))
      .limit(limit);
    return sessions.map(s => s.practice_sessions);
  }
  
  // Problem Attempts
  async createProblemAttempt(insertAttempt: InsertProblemAttempt): Promise<ProblemAttempt> {
    const [attempt] = await db
      .insert(problemAttempts)
      .values(insertAttempt)
      .returning();
    return attempt;
  }
  
  async getSessionAttempts(sessionId: string): Promise<ProblemAttempt[]> {
    return await db
      .select()
      .from(problemAttempts)
      .where(eq(problemAttempts.sessionId, sessionId));
  }
  
  // Student Goals
  async createStudentGoal(insertGoal: InsertStudentGoal): Promise<StudentGoal> {
    const [goal] = await db
      .insert(studentGoals)
      .values(insertGoal)
      .returning();
    return goal;
  }
  
  async updateStudentGoal(id: string, userId: string, updates: Partial<StudentGoal>): Promise<StudentGoal | undefined> {
    // First verify the goal belongs to a student owned by the user
    const goals = await db
      .select({ goalId: studentGoals.id })
      .from(studentGoals)
      .innerJoin(students, eq(studentGoals.studentId, students.id))
      .where(
        and(
          eq(studentGoals.id, id),
          eq(students.userId, userId)
        )
      );
    
    if (goals.length === 0) return undefined;
    
    const [goal] = await db
      .update(studentGoals)
      .set(updates)
      .where(eq(studentGoals.id, id))
      .returning();
    return goal || undefined;
  }
  
  async getStudentGoals(studentId: string, userId: string): Promise<StudentGoal[]> {
    const goals = await db
      .select()
      .from(studentGoals)
      .innerJoin(students, eq(studentGoals.studentId, students.id))
      .where(
        and(
          eq(studentGoals.studentId, studentId),
          eq(students.userId, userId)
        )
      );
    return goals.map(g => g.student_goals);
  }
}

export const storage = new DatabaseStorage();
