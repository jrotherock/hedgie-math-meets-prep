# Overview

Hedgie Math Meets Prep is a kid-friendly Math League competition preparation PWA designed for elementary students (grades 3-6). The application serves as an AI-powered coaching assistant that helps students practice and prepare for Math League competitions through interactive problem-solving sessions, progress tracking, and personalized learning experiences. The app features a warm, approachable design inspired by educational apps like Khan Academy Kids and Duolingo, with a friendly hedgehog mascot named Hedgie as the coach.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built as a React-based Progressive Web App using modern web technologies:
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with a custom design system featuring warm, kid-friendly colors and typography
- **Component Library**: Radix UI primitives with shadcn/ui components for consistent, accessible UI elements
- **State Management**: TanStack React Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture  
The server follows a RESTful API design built on Node.js:
- **Framework**: Express.js with TypeScript for the web server
- **API Structure**: RESTful endpoints organized by feature (problems, practice sessions, student management)
- **Problem Generation**: OpenAI GPT integration for generating Math League problems dynamically
- **Request Validation**: Zod schemas for type-safe request/response validation
- **Error Handling**: Centralized error middleware with structured error responses

## Database Layer
The application uses a PostgreSQL database with Drizzle ORM:
- **Database**: Neon PostgreSQL for cloud-hosted database
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema**: Relational design with tables for users, students, problems, practice sessions, problem attempts, and student goals
- **Data Types**: Support for Math League round types (sprint, target, numbersense, team) with appropriate scoring systems

## Authentication & Authorization
User management system for parent/coach oversight:
- **User Model**: Parent/coach accounts that can manage multiple student profiles
- **Student Profiles**: Individual student accounts with grade level, goals, and progress tracking
- **Session Management**: Express sessions with PostgreSQL session store
- **Access Control**: Route-level protection ensuring users can only access their own student data

## Math League Integration
Specialized features for Math League competition preparation:
- **Round Types**: Support for all four Math League rounds (Number Sense, Sprint, Target, Team) with accurate timing and scoring
- **Problem Generation**: AI-powered problem creation that mirrors official Math League difficulty and style
- **Practice Sessions**: Timed practice rounds that simulate real competition conditions
- **Progress Tracking**: Composite scoring system that matches official Math League scoring rules

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Cloud-hosted PostgreSQL database for data persistence
- **Connection Pooling**: @neondatabase/serverless for efficient database connections

## AI Integration
- **OpenAI API**: GPT model for generating authentic Math League problems
- **Problem Categories**: Support for generating problems across different Math League topics and difficulty levels

## UI Components
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide Icons**: Icon library for consistent iconography
- **Google Fonts**: Poppins and Inter fonts for kid-friendly typography

## Development Tools
- **TypeScript**: Static type checking across the entire stack
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Vite**: Build tool with hot module replacement and optimized builds
- **ESBuild**: Fast JavaScript bundler for server-side code

## Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Express Session**: Server-side session management

## Validation & Forms
- **Zod**: Runtime type validation for API endpoints and form data
- **React Hook Form**: Form management with validation integration