import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import hedgehogImage from "@assets/generated_images/Hedgehog_teacher_character_ad6d59a4.png";

interface Goal {
  title: string;
  current: number;
  target: number;
  color: string;
}

interface GoalsCardProps {
  goals: Goal[];
}

export default function GoalsCard({ goals }: GoalsCardProps) {
  return (
    <Card data-testid="card-goals">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-card-foreground">{goal.title}</span>
              <span className="text-xs text-muted-foreground">
                {goal.current}/{goal.target}
              </span>
            </div>
            <Progress 
              value={(goal.current / goal.target) * 100} 
              className="h-2"
              data-testid={`progress-${goal.title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </div>
        ))}
        
        <div className="flex justify-center pt-4">
          <img 
            src={hedgehogImage} 
            alt="Hedgie Coach" 
            className="w-20 h-20 opacity-80"
            data-testid="hedgehog-goals"
          />
        </div>
      </CardContent>
    </Card>
  );
}