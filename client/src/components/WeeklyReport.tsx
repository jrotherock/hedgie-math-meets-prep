import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WeeklyReportProps {
  totalMinutes: number;
  weeklyGoal: number;
  weekChange: number;
  projectedScore: number;
  targetScore: number;
  weeksToMeet: number;
  status: 'on-track' | 'behind' | 'ahead';
}

export default function WeeklyReport({ 
  totalMinutes, 
  weeklyGoal, 
  weekChange, 
  projectedScore, 
  targetScore, 
  weeksToMeet, 
  status 
}: WeeklyReportProps) {
  const statusColors = {
    'on-track': 'bg-green-100 text-green-800',
    'behind': 'bg-red-100 text-red-800',
    'ahead': 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="space-y-4" data-testid="weekly-report">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card data-testid="card-snapshot">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Snapshot</CardTitle>
            <p className="text-xs text-muted-foreground">Composite Projection</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-card-foreground">{totalMinutes}</span>
                <span className="text-sm text-muted-foreground">Minutes practiced this week</span>
                <span className="text-sm text-green-600">+{weekChange} vs last week</span>
              </div>
              <Progress 
                value={(totalMinutes / weeklyGoal) * 100} 
                className="h-2"
                data-testid="progress-weekly-minutes"
              />
              <div className="text-xs text-muted-foreground">
                {weeklyGoal} / {weeklyGoal} min (school nights goal)
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-pacing">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pacing to Goal</CardTitle>
            <p className="text-xs text-muted-foreground">
              Weeks to meet: {weeksToMeet} • Goal: {targetScore} • Current: {projectedScore}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Needed slope: +2.0 pts/wk • Observed: +3.1 pts/wk
              </div>
              <Badge className={statusColors[status]} data-testid="badge-status">
                {status === 'on-track' ? 'On Track' : status === 'behind' ? 'Behind' : 'Ahead'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card data-testid="card-round-performance">
        <CardHeader>
          <CardTitle className="text-base">Round-by-round</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: 'Sprint', accuracy: 76, penalty: 8, projected: '76 / 120' },
            { name: 'Target', solved: 1.1, projected: '40 / 80' },
            { name: 'Number Sense', average: 72, projected: '18 / 100' }
          ].map((round, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {round.name} — {'accuracy' in round ? `accuracy ${round.accuracy}%` : 
                    'solved' in round ? `solved per pair ${round.solved}` :
                    `avg raw +${round.average}`}
                  {'penalty' in round && ` • penalty ${round.penalty}%`}
                </span>
                <span className="text-xs text-muted-foreground">
                  Projected: {round.projected}
                </span>
              </div>
              <Progress 
                value={('accuracy' in round ? round.accuracy : 
                       'solved' in round ? (round.solved || 0) * 50 :
                       'average' in round ? round.average : 0)} 
                className="h-2"
                data-testid={`progress-${round.name.toLowerCase().replace(' ', '-')}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}