import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamRoleCardProps {
  role: string;
  description: string;
  color: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function TeamRoleCard({ role, description, color, isSelected, onClick }: TeamRoleCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100',
    green: 'bg-green-100'
  };

  return (
    <Card 
      className={`hover-elevate cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
      data-testid={`card-team-role-${role.toLowerCase()}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">{role}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className={`w-8 h-8 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}></div>
        </div>
      </CardContent>
    </Card>
  );
}