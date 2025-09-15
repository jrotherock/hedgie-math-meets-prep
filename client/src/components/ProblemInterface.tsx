import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProblemInterfaceProps {
  roundType: 'sprint' | 'target' | 'numbersense' | 'team';
  problem: {
    id: string;
    text: string;
    choices?: string[];
    type: 'multiple_choice' | 'numerical';
  };
  onAnswer: (answer: string) => void;
  showHint?: boolean;
}

export default function ProblemInterface({ roundType, problem, onAnswer, showHint }: ProblemInterfaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [numericalAnswer, setNumericalAnswer] = useState<string>('');

  const handleSubmit = () => {
    const answer = problem.type === 'multiple_choice' ? selectedAnswer : numericalAnswer;
    onAnswer(answer);
    console.log(`Submitted answer: ${answer}`);
  };

  const roundColors = {
    sprint: 'border-l-4 border-l-orange-400',
    target: 'border-l-4 border-l-blue-400',
    numbersense: 'border-l-4 border-l-green-400', 
    team: 'border-l-4 border-l-purple-400'
  };

  return (
    <Card className={`${roundColors[roundType]}`} data-testid="card-problem">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" data-testid="badge-round-type">
            {roundType.charAt(0).toUpperCase() + roundType.slice(1)}
          </Badge>
          <div className="flex gap-2">
            {showHint && (
              <Button 
                variant="outline" 
                size="sm" 
                data-testid="button-hint"
                onClick={() => console.log('Hint requested')}
              >
                Hint
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              data-testid="button-next"
              onClick={() => console.log('Next problem')}
            >
              Next →
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-lg text-card-foreground" data-testid="problem-text">
          {problem.text}
        </div>
        
        {problem.type === 'multiple_choice' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {problem.choices?.map((choice, index) => {
              const letter = String.fromCharCode(65 + index);
              return (
                <Button
                  key={index}
                  variant={selectedAnswer === letter ? "default" : "outline"}
                  className="text-left justify-start h-auto p-4 hover-elevate"
                  onClick={() => setSelectedAnswer(letter)}
                  data-testid={`button-choice-${letter}`}
                >
                  <span className="font-semibold mr-2">{letter}.</span>
                  {choice}
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Answer (simplest form)"
              value={numericalAnswer}
              onChange={(e) => setNumericalAnswer(e.target.value)}
              className="text-lg"
              data-testid="input-numerical-answer"
            />
            {roundType === 'numbersense' && (
              <div className="text-xs text-muted-foreground">
                Estimation → integer only
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={problem.type === 'multiple_choice' ? !selectedAnswer : !numericalAnswer}
            data-testid="button-submit-answer"
          >
            Submit Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}