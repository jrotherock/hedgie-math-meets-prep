import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RoundCardProps {
  title: string;
  description: string;
  duration: string;
  calcAllowed: boolean;
  color: 'orange' | 'blue' | 'green' | 'purple';
  onClick?: () => void;
}

export default function RoundCard({ title, description, duration, calcAllowed, color, onClick }: RoundCardProps) {
  const colorClasses = {
    orange: 'border-l-4 border-l-orange-400',
    blue: 'border-l-4 border-l-blue-400', 
    green: 'border-l-4 border-l-green-400',
    purple: 'border-l-4 border-l-purple-400'
  };

  const badgeColors = {
    orange: 'bg-orange-100 text-orange-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800', 
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <Card 
      className={`hover-elevate cursor-pointer transition-all ${colorClasses[color]}`}
      onClick={onClick}
      data-testid={`card-round-${title.toLowerCase().replace(' ', '-')}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
          <Badge 
            className={`${badgeColors[color]} ${calcAllowed ? '' : 'opacity-70'}`}
            data-testid={`badge-calc-${calcAllowed ? 'ok' : 'no'}`}
          >
            {calcAllowed ? 'Calc OK' : 'No Calc'}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-card-foreground">{duration}</span>
          <Button size="sm" data-testid={`button-start-${title.toLowerCase().replace(' ', '-')}`}>
            Start Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}