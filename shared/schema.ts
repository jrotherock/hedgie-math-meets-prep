import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const roundTypeEnum = pgEnum('round_type', ['sprint', 'target', 'numbersense', 'team']);
export const goalTypeEnum = pgEnum('goal_type', ['composite_score', 'accuracy', 'speed']);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  parentEmail: text("parent_email"),
  gradeLevel: integer("grade_level").notNull().default(4),
  createdAt: timestamp("created_at").defaultNow(),
});

// Math problems table
export const problems = pgTable("problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: roundTypeEnum("type").notNull(),
  prompt: text("prompt").notNull(),
  answer: text("answer").notNull(),
  choices: jsonb("choices"), // Array of choices for multiple choice
  difficulty: integer("difficulty").notNull().default(3), // 1-5 scale
  tags: jsonb("tags").notNull().default(sql`'[]'::jsonb`), // Array of topic tags
  source: text("source"), // Where problem came from
  isGenerated: boolean("is_generated").notNull().default(false), // AI generated or manual
  createdAt: timestamp("created_at").defaultNow(),
});

// Practice sessions table
export const practiceSessions = pgTable("practice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  roundType: roundTypeEnum("round_type").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull().default(0),
  score: integer("score").notNull().default(0), // Final calculated score
  timeSpent: integer("time_spent"), // seconds
  settings: jsonb("settings").default(sql`'{}'::jsonb`), // Session configuration
});

// Individual problem attempts table
export const problemAttempts = pgTable("problem_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => practiceSessions.id),
  problemId: varchar("problem_id").notNull().references(() => problems.id),
  studentAnswer: text("student_answer"),
  isCorrect: boolean("is_correct").notNull().default(false),
  timeSpent: integer("time_spent"), // seconds for this problem
  hintsUsed: integer("hints_used").notNull().default(0),
  attemptedAt: timestamp("attempted_at").defaultNow(),
});

// Student goals table
export const studentGoals = pgTable("student_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  goalType: goalTypeEnum("goal_type").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  practiceSessions: many(practiceSessions),
  goals: many(studentGoals),
}));

export const practiceSessionsRelations = relations(practiceSessions, ({ one, many }) => ({
  student: one(students, {
    fields: [practiceSessions.studentId],
    references: [students.id],
  }),
  problemAttempts: many(problemAttempts),
}));

export const problemAttemptsRelations = relations(problemAttempts, ({ one }) => ({
  session: one(practiceSessions, {
    fields: [problemAttempts.sessionId],
    references: [practiceSessions.id],
  }),
  problem: one(problems, {
    fields: [problemAttempts.problemId],
    references: [problems.id],
  }),
}));

export const studentGoalsRelations = relations(studentGoals, ({ one }) => ({
  student: one(students, {
    fields: [studentGoals.studentId],
    references: [students.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  passwordHash: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeSessionSchema = createInsertSchema(practiceSessions).omit({
  id: true,
  startedAt: true,
});

export const insertProblemAttemptSchema = createInsertSchema(problemAttempts).omit({
  id: true,
  attemptedAt: true,
});

export const insertStudentGoalSchema = createInsertSchema(studentGoals).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type PracticeSession = typeof practiceSessions.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type ProblemAttempt = typeof problemAttempts.$inferSelect;
export type InsertProblemAttempt = z.infer<typeof insertProblemAttemptSchema>;
export type StudentGoal = typeof studentGoals.$inferSelect;
export type InsertStudentGoal = z.infer<typeof insertStudentGoalSchema>;
