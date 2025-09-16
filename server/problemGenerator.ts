// OpenAI integration for Math League problem generation
// Uses blueprint:javascript_openai
import OpenAI from "openai";
import type { Problem, InsertProblem } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GeneratedProblem {
  prompt: string;
  answer: string;
  choices?: string[];
  explanation: string;
  difficulty: number;
  tags: string[];
}

interface ProblemGenerationRequest {
  roundType: 'sprint' | 'target' | 'numbersense' | 'team';
  difficulty: number; // 1-5 scale
  topics?: string[];
  gradeLevel?: number;
}

export class MathLeagueProblemGenerator {
  private getSystemPrompt(roundType: string): string {
    const basePrompt = `You are Hedgie, a friendly hedgehog Math League coach for elementary students (grades 3-6). Generate authentic Math League competition problems that mirror official mathleague.org style and difficulty.`;
    
    const roundSpecifics = {
      sprint: `
SPRINT ROUND: Generate multiple choice problems (A-D) that can be solved in 1-2 minutes without calculator.
- Focus on: arithmetic, fractions, decimals, basic geometry, number theory
- Provide 4 clear answer choices
- Avoid trick questions, keep straightforward`,
      
      target: `
TARGET ROUND: Generate paired problems that require calculator and deeper thinking (3-4 minutes each).
- Focus on: algebra, advanced geometry, number patterns, word problems
- Problems should be challenging but solvable
- Numerical answers only (no multiple choice)`,
      
      numbersense: `
NUMBER SENSE ROUND: Generate mental math problems solvable in 30 seconds.
- Focus on: quick arithmetic, estimation, number recognition
- Integer answers only
- Problems should reward mental math shortcuts`,
      
      team: `
TEAM ROUND: Generate collaborative problems requiring 2-3 minutes of team discussion.
- Focus on: multi-step word problems, logic, team strategy
- Should encourage discussion and different approaches
- Numerical answers only`
    };
    
    return basePrompt + (roundSpecifics[roundType as keyof typeof roundSpecifics] || '');
  }
  
  private getExampleProblems(roundType: string): string {
    const examples = {
      sprint: `
Example Sprint problems:
- "What is 3/4 + 1/6?" (A) 5/10 (B) 11/12 (C) 4/10 (D) 5/6
- "A rectangle has length 8 and width 5. What is its area?" (A) 13 (B) 26 (C) 40 (D) 45`,
      
      target: `
Example Target problems:
- "The sum of two consecutive integers is 37. What is the larger integer?"
- "A circle has radius 6. What is its circumference? (Use π = 3.14)"`,
      
      numbersense: `
Example Number Sense problems:
- "25 × 16 = ?"
- "What is 15% of 80?"
- "How many seconds in 2.5 minutes?"`,
      
      team: `
Example Team problems:
- "Sarah has 3 times as many stickers as Tom. Together they have 48 stickers. How many does Sarah have?"
- "A pizza is cut into 8 equal slices. If 3/4 of the pizza is eaten, how many slices remain?"`
    };
    
    return examples[roundType as keyof typeof examples] || '';
  }

  async generateProblem(request: ProblemGenerationRequest): Promise<GeneratedProblem> {
    // First try OpenAI, then fallback to pre-made problems if quota exceeded
    try {
      return await this.generateWithOpenAI(request);
    } catch (error) {
      console.log('OpenAI unavailable, using fallback problems:', error instanceof Error ? error.message : String(error));
      return this.getFallbackProblem(request);
    }
  }
  
  private async generateWithOpenAI(request: ProblemGenerationRequest): Promise<GeneratedProblem> {
    const systemPrompt = this.getSystemPrompt(request.roundType);
    const examples = this.getExampleProblems(request.roundType);
    const topicFilter = request.topics?.length ? `Focus on these topics: ${request.topics.join(', ')}.` : '';
    
    const userPrompt = `Generate 1 authentic Math League ${request.roundType} problem for grade ${request.gradeLevel || 4} students.

Difficulty: ${request.difficulty}/5
${topicFilter}
${examples}

Return your response as JSON with this exact structure:
{
  "prompt": "The problem statement",
  "answer": "Correct answer (just the value)",
  "choices": ${request.roundType === 'sprint' ? '["A option", "B option", "C option", "D option"]' : 'null'},
  "explanation": "Kid-friendly solution explanation",
  "difficulty": ${request.difficulty},
  "tags": ["topic1", "topic2"]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Validate the generated problem
      if (!result.prompt || !result.answer) {
        throw new Error('Generated problem missing required fields');
      }
      
      // Ensure sprint problems have choices
      if (request.roundType === 'sprint' && (!result.choices || result.choices.length !== 4)) {
        throw new Error('Sprint problems must have exactly 4 multiple choice options');
      }
      
      return {
        prompt: result.prompt,
        answer: result.answer,
        choices: result.choices || null,
        explanation: result.explanation || 'Solution explanation not provided',
        difficulty: result.difficulty || request.difficulty,
        tags: Array.isArray(result.tags) ? result.tags : ['general']
      };
    } catch (error) {
      console.error('Problem generation failed:', error);
      throw new Error(`Failed to generate ${request.roundType} problem: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private getFallbackProblem(request: ProblemGenerationRequest): GeneratedProblem {
    const fallbackProblems = {
      sprint: [
        {
          prompt: "What is 3/4 + 1/8?",
          answer: "7/8",
          choices: ["7/8", "4/12", "1/2", "5/8"],
          explanation: "Find common denominator: 3/4 = 6/8, then 6/8 + 1/8 = 7/8",
          difficulty: 3,
          tags: ["fractions", "addition"]
        },
        {
          prompt: "A rectangle has length 9 and width 4. What is its perimeter?",
          answer: "26",
          choices: ["26", "36", "13", "18"],
          explanation: "Perimeter = 2(length + width) = 2(9 + 4) = 2(13) = 26",
          difficulty: 2,
          tags: ["geometry", "perimeter"]
        },
        {
          prompt: "What is 15% of 60?",
          answer: "9",
          choices: ["9", "12", "6", "15"],
          explanation: "15% = 0.15, so 0.15 × 60 = 9",
          difficulty: 3,
          tags: ["percentages", "multiplication"]
        }
      ],
      target: [
        {
          prompt: "The sum of two consecutive even integers is 74. What is the larger integer?",
          answer: "38",
          explanation: "Let x be first even integer. Then x + (x+2) = 74, so 2x + 2 = 74, 2x = 72, x = 36. Larger is 38.",
          difficulty: 4,
          tags: ["algebra", "consecutive integers"]
        },
        {
          prompt: "A circle has diameter 12. What is its area? (Use π = 3.14)",
          answer: "113.04",
          explanation: "Radius = 6, Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04",
          difficulty: 3,
          tags: ["geometry", "circles", "area"]
        }
      ],
      numbersense: [
        {
          prompt: "25 × 16",
          answer: "400",
          explanation: "25 × 16 = 25 × 4 × 4 = 100 × 4 = 400",
          difficulty: 3,
          tags: ["multiplication", "mental math"]
        },
        {
          prompt: "What is 20% of 85?",
          answer: "17",
          explanation: "20% = 1/5, so 85 ÷ 5 = 17",
          difficulty: 2,
          tags: ["percentages", "mental math"]
        }
      ],
      team: [
        {
          prompt: "A pizza is cut into 12 equal slices. If 3/4 of the pizza is eaten, how many slices remain?",
          answer: "3",
          explanation: "3/4 of 12 slices = 9 slices eaten. 12 - 9 = 3 slices remain.",
          difficulty: 2,
          tags: ["fractions", "word problems"]
        },
        {
          prompt: "Tom has twice as many marbles as Sarah. Together they have 36 marbles. How many does Tom have?",
          answer: "24",
          explanation: "Let Sarah have x marbles. Tom has 2x. x + 2x = 36, so 3x = 36, x = 12. Tom has 24.",
          difficulty: 4,
          tags: ["algebra", "word problems"]
        }
      ]
    };
    
    const problemsForType = fallbackProblems[request.roundType] || fallbackProblems.sprint;
    const randomProblem = problemsForType[Math.floor(Math.random() * problemsForType.length)];
    
    return {
      ...randomProblem,
      difficulty: request.difficulty // Override with requested difficulty
    };
  }

  async generateMultipleProblems(request: ProblemGenerationRequest, count: number = 5): Promise<GeneratedProblem[]> {
    const problems = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const problem = await this.generateProblem(request);
        problems.push(problem);
        
        // Small delay to avoid rate limits
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Failed to generate problem ${i + 1}:`, error instanceof Error ? error.message : String(error));
        // Continue generating other problems even if one fails
      }
    }
    
    return problems;
  }

  convertToInsertProblem(generated: GeneratedProblem, roundType: string): InsertProblem {
    return {
      type: roundType as 'sprint' | 'target' | 'numbersense' | 'team',
      prompt: generated.prompt,
      answer: generated.answer,
      choices: generated.choices ? JSON.stringify(generated.choices) : null,
      difficulty: generated.difficulty,
      tags: JSON.stringify(generated.tags),
      source: 'AI Generated - Hedgie Coach',
      isGenerated: true
    };
  }
}

export const problemGenerator = new MathLeagueProblemGenerator();