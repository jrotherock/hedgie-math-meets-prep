import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, Target, Zap } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import ProblemInterface from './ProblemInterface';

interface PracticeSessionProps {
  studentId: string;
  roundType: 'sprint' | 'target' | 'numbersense' | 'team';
  onComplete: (results: SessionResults) => void;
  onCancel: () => void;
}

interface SessionResults {
  sessionId: string;
  roundType: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  accuracy: number;
}

interface Problem {
  id: string;
  type: 'sprint' | 'target' | 'numbersense' | 'team';
  prompt: string;
  answer: string;
  choices?: string[];
  difficulty: number;
  explanation?: string;
}

interface SessionConfig {
  duration: number; // minutes
  questionCount: number;
  calculatorAllowed: boolean;
  scoringSystem: 'standard' | 'penalty' | 'target';
  description: string;
}

const SESSION_CONFIGS: Record<string, SessionConfig> = {
  sprint: {
    duration: 40,
    questionCount: 30,
    calculatorAllowed: false,
    scoringSystem: 'penalty',
    description: '40 min • 30 multiple choice • -1 for wrong answers'
  },
  target: {
    duration: 24,
    questionCount: 8,
    calculatorAllowed: true,
    scoringSystem: 'standard',
    description: '4 pairs × 6 min • calculators allowed'
  },
  numbersense: {
    duration: 10,
    questionCount: 80,
    calculatorAllowed: false,
    scoringSystem: 'standard',
    description: '10 min • 80 problems • mental math only'
  },
  team: {
    duration: 20,
    questionCount: 10,
    calculatorAllowed: true,
    scoringSystem: 'standard',
    description: '20 min • 10 problems • calculators allowed'
  }
};

export default function PracticeSession({ studentId, roundType, onComplete, onCancel }: PracticeSessionProps) {
  const config = SESSION_CONFIGS[roundType];
  const { toast } = useToast();
  
  // Session state
  const [sessionId, setSessionId] = useState<string>('');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(config.duration * 60); // seconds
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [problemStartTime, setProblemStartTime] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/practice-sessions', {
        studentId,
        roundType,
        totalQuestions: config.questionCount
      });
      const data = await response.json();
      return data.session;
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      setIsSessionActive(true);
      setSessionStartTime(Date.now());
      setProblemStartTime(Date.now());
    }
  });

  // Generate problems query
  const { data: generatedProblems, isLoading: isGeneratingProblems } = useQuery({
    queryKey: ['generate-problems', roundType, config.questionCount],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/problems/generate', {
        roundType,
        difficulty: 3,
        gradeLevel: 4,
        count: Math.min(config.questionCount, 10) // Generate in batches
      });
      const data = await response.json();
      return data.problems || [data.problem]; // Handle both single and batch responses
    },
    enabled: false // Don't run automatically
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ problemId, answer, timeSpent, hintsUsed }: {
      problemId: string;
      answer: string;
      timeSpent: number;
      hintsUsed: number;
    }) => {
      const response = await apiRequest('POST', '/api/practice-sessions/submit-answer', {
        sessionId,
        problemId,
        studentAnswer: answer,
        timeSpent,
        hintsUsed
      });
      return await response.json();
    }
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async ({ score, timeSpent }: { score: number; timeSpent: number }) => {
      const response = await apiRequest('POST', `/api/practice-sessions/${sessionId}/complete`, {
        score,
        timeSpent
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['student-progress'] });
    }
  });

  // Generate more problems when needed
  const generateMoreProblems = async () => {
    try {
      const response = await apiRequest('POST', '/api/problems/generate', {
        roundType,
        difficulty: 3,
        gradeLevel: 4,
        count: 10 // Generate 10 more problems
      });
      
      const problemData = await response.json();
      const newProblems = problemData.problems || [problemData.problem];
      setProblems(prev => [...prev, ...newProblems]);
    } catch (error) {
      console.error('Failed to generate more problems:', error);
    }
  };

  // Initialize session with robust fallback
  const startSession = async () => {
    try {
      console.log('Starting session for roundType:', roundType);
      
      // Create session first
      console.log('Creating session...');
      await createSessionMutation.mutateAsync();
      console.log('Session created successfully');
      
      // Try to generate problems with immediate fallback on any error
      let generatedProblems = [];
      try {
        console.log('Generating problems...');
        const response = await apiRequest('POST', '/api/problems/generate', {
          roundType,
          difficulty: 3,
          gradeLevel: 4,
          count: 10
        });
        
        const problemData = await response.json();
        generatedProblems = problemData.problems || [problemData.problem];
        console.log('Generated problems from API:', generatedProblems.length, 'problems');
      } catch (error) {
        console.warn('Problem generation failed, using local fallback:', error);
        // Use local fallback problems immediately
        generatedProblems = getLocalFallbackProblems(roundType, 10);
        console.log('Using local fallback problems:', generatedProblems.length, 'problems');
      }
      
      // Ensure we have problems before proceeding
      if (generatedProblems.length === 0) {
        throw new Error('No problems available');
      }
      
      setProblems(generatedProblems);
      
      toast({
        title: "Session Started!",
        description: `Get ready for ${config.description}`,
      });
    } catch (error) {
      console.error('Session start failed:', error);
      toast({
        title: "Failed to Start Session",
        description: "Please try again later",
        variant: "destructive",
      });
      // Fallback to home on critical failure
      onCancel();
    }
  };
  
  // Local fallback problems for immediate availability
  const getLocalFallbackProblems = (roundType: string, count: number) => {
    const fallbackProblems = {
      sprint: [
        {
          id: 'local-sprint-1',
          prompt: 'What is 3/4 + 1/8?',
          answer: '7/8',
          choices: ['7/8', '4/12', '1/2', '5/8'],
          explanation: 'Find common denominator: 3/4 = 6/8, then 6/8 + 1/8 = 7/8'
        },
        {
          id: 'local-sprint-2', 
          prompt: 'A rectangle has length 9 and width 4. What is its perimeter?',
          answer: '26',
          choices: ['26', '36', '13', '18'],
          explanation: 'Perimeter = 2(length + width) = 2(9 + 4) = 2(13) = 26'
        },
        {
          id: 'local-sprint-3',
          prompt: 'What is 15% of 60?',
          answer: '9',
          choices: ['9', '12', '6', '15'],
          explanation: '15% = 0.15, so 0.15 × 60 = 9'
        }
      ],
      target: [
        {
          id: 'local-target-1',
          prompt: 'The sum of two consecutive even integers is 74. What is the larger integer?',
          answer: '38',
          explanation: 'Let x be first even integer. Then x + (x+2) = 74, so 2x + 2 = 74, 2x = 72, x = 36. Larger is 38.'
        },
        {
          id: 'local-target-2',
          prompt: 'A circle has diameter 12. What is its area? (Use π = 3.14)',
          answer: '113.04',
          explanation: 'Radius = 6, Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04'
        }
      ],
      numbersense: [
        {
          id: 'local-ns-1',
          prompt: '25 × 16',
          answer: '400',
          explanation: '25 × 16 = 25 × 4 × 4 = 100 × 4 = 400'
        },
        {
          id: 'local-ns-2', 
          prompt: 'What is 20% of 85?',
          answer: '17',
          explanation: '20% = 1/5, so 85 ÷ 5 = 17'
        }
      ],
      team: [
        {
          id: 'local-team-1',
          prompt: 'A pizza is cut into 12 equal slices. If 3/4 of the pizza is eaten, how many slices remain?',
          answer: '3',
          explanation: '3/4 of 12 slices = 9 slices eaten. 12 - 9 = 3 slices remain.'
        },
        {
          id: 'local-team-2',
          prompt: 'Tom has twice as many marbles as Sarah. Together they have 36 marbles. How many does Tom have?',
          answer: '24', 
          explanation: 'Let Sarah have x marbles. Tom has 2x. x + 2x = 36, so 3x = 36, x = 12. Tom has 24.'
        }
      ]
    };
    
    const problems = fallbackProblems[roundType as keyof typeof fallbackProblems] || fallbackProblems.sprint;
    // Repeat problems to fill count if needed
    const repeated = [];
    for (let i = 0; i < count; i++) {
      const problem = problems[i % problems.length];
      repeated.push({
        ...problem,
        id: `${problem.id}-${i}`, // Make IDs unique
        type: roundType,
        difficulty: 3,
        tags: ['fallback']
      });
    }
    return repeated;
  };

  // Auto-start session on component mount
  useEffect(() => {
    startSession();
  }, []); // Empty dependency array = run once on mount

  // Timer effect
  useEffect(() => {
    if (!isSessionActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSessionActive(false);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, timeRemaining]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer submission
  const handleAnswer = async (answer: string) => {
    if (!problems[currentProblemIndex]) return;

    const currentTime = Date.now();
    const timeSpentOnProblem = Math.round((currentTime - problemStartTime) / 1000);
    const currentHints = hintsUsed[currentProblemIndex] || 0;
    
    // Record answer
    setAnswers(prev => ({ ...prev, [currentProblemIndex]: answer }));
    
    // Submit to backend
    try {
      await submitAnswerMutation.mutateAsync({
        problemId: problems[currentProblemIndex].id,
        answer,
        timeSpent: timeSpentOnProblem,
        hintsUsed: currentHints
      });
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }

    // Generate more problems if running low
    if (currentProblemIndex >= problems.length - 3 && problems.length < config.questionCount) {
      generateMoreProblems();
    }

    // Move to next problem
    if (currentProblemIndex < Math.min(problems.length - 1, config.questionCount - 1)) {
      setCurrentProblemIndex(prev => prev + 1);
      setProblemStartTime(currentTime);
    } else {
      // Session complete
      handleSessionComplete();
    }
  };

  // Handle hint request
  const handleHint = () => {
    setHintsUsed(prev => ({
      ...prev,
      [currentProblemIndex]: (prev[currentProblemIndex] || 0) + 1
    }));
    
    toast({
      title: "Hint from Hedgie! 🦔",
      description: problems[currentProblemIndex]?.explanation || "Think step by step and look for patterns!",
    });
  };

  // Calculate score using Math League rules
  const calculateScore = () => {
    const correctAnswers = Object.keys(answers).length; // This would be calculated properly from backend
    const totalAnswered = Object.keys(answers).length;
    
    switch (config.scoringSystem) {
      case 'penalty': // Sprint: +1 correct, -1 incorrect
        return Math.max(0, correctAnswers - (totalAnswered - correctAnswers));
      case 'standard': // Target, Team, Number Sense: +1 correct, 0 incorrect
        return correctAnswers;
      default:
        return correctAnswers;
    }
  };

  // Handle session completion
  const handleSessionComplete = async () => {
    if (!sessionId) return;
    
    setIsSessionActive(false);
    const totalTimeSpent = Math.round((Date.now() - sessionStartTime) / 1000);
    const score = calculateScore();
    const correctAnswers = Object.keys(answers).length; // Would be calculated from backend
    
    try {
      await completeSessionMutation.mutateAsync({
        score,
        timeSpent: totalTimeSpent
      });

      const results: SessionResults = {
        sessionId,
        roundType,
        score,
        correctAnswers,
        totalQuestions: config.questionCount,
        timeSpent: totalTimeSpent,
        accuracy: correctAnswers / Object.keys(answers).length * 100
      };

      setShowResults(true);
      
      setTimeout(() => {
        onComplete(results);
      }, 3000); // Show results for 3 seconds
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save session results",
        variant: "destructive",
      });
    }
  };

  // Progress calculation
  const progress = problems.length > 0 ? (currentProblemIndex / problems.length) * 100 : 0;
  const timeProgress = (1 - (timeRemaining / (config.duration * 60))) * 100;

  // Loading state
  if (createSessionMutation.isPending || isGeneratingProblems || problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-lg font-medium">Preparing your {roundType} session...</div>
        <div className="text-sm text-muted-foreground">Hedgie is getting your problems ready! 🦔</div>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    const accuracy = Object.keys(answers).length > 0 ? 
      (Object.keys(answers).length / Object.keys(answers).length) * 100 : 0;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="text-3xl">🎉</div>
          <h2 className="text-2xl font-bold">Great Job!</h2>
          <p className="text-muted-foreground">You completed the {roundType} round</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentProblemIndex];
  if (!currentProblem) return null;

  return (
    <div className="space-y-6" data-testid="practice-session">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize" data-testid="text-session-title">
            {roundType} Round
          </h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <Button variant="outline" onClick={onCancel} data-testid="button-cancel-session">
          End Session
        </Button>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timer */}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <div>
                <div className="text-lg font-mono" data-testid="text-timer">
                  {formatTime(timeRemaining)}
                </div>
                <Progress value={timeProgress} className="w-full mt-1" />
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium" data-testid="text-progress">
                  Problem {currentProblemIndex + 1} of {problems.length}
                </div>
                <Progress value={progress} className="w-full mt-1" />
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <div>
                <div className="text-sm font-medium" data-testid="text-score">
                  Score: {calculateScore()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Answered: {Object.keys(answers).length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Interface */}
      <ProblemInterface
        roundType={roundType}
        problem={{
          id: currentProblem.id,
          text: currentProblem.prompt,
          choices: currentProblem.choices,
          type: currentProblem.choices ? 'multiple_choice' : 'numerical'
        }}
        onAnswer={handleAnswer}
        showHint={true}
        onHint={handleHint}
      />
      
      {/* Hedgie Encouragement */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🦔</div>
            <div>
              <p className="text-sm font-medium">Hedgie says:</p>
              <p className="text-sm text-muted-foreground">
                {currentProblemIndex < 5 ? "You're doing great! Take your time." :
                 currentProblemIndex < 15 ? "Keep up the good work!" :
                 "You're almost there! Stay focused!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}