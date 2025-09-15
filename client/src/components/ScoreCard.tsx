import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  color: string;
  subtitle?: string;
}

export default function ScoreCard({ title, score, maxScore, color, subtitle }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  
  const colorClasses = {
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100', 
    green: 'bg-green-100',
    purple: 'bg-purple-100'
  };

  return (
    <Card data-testid={`card-score-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-card-foreground">{score}</span>
          <span className="text-lg text-muted-foreground">/ {maxScore}</span>
        </div>
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-3"
            data-testid={`progress-score-${title.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gray-200 rounded-r opacity-30"></div>
        </div>
      </CardContent>
    </Card>
  );
}