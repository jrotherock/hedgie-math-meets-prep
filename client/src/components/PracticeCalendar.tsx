import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalendarDay {
  day: number;
  minutes?: number;
  rounds?: string[];
  isToday?: boolean;
}

interface PracticeCalendarProps {
  month: string;
  days: CalendarDay[];
}

export default function PracticeCalendar({ month, days }: PracticeCalendarProps) {
  const roundColors = {
    'NS': 'bg-green-100 text-green-800',
    'SP': 'bg-blue-100 text-blue-800', 
    'TG': 'bg-yellow-100 text-yellow-800',
    'TM': 'bg-purple-100 text-purple-800'
  };

  return (
    <Card data-testid="card-practice-calendar">
      <CardHeader>
        <CardTitle className="text-lg">{month} — minutes & round chips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayData, index) => (
            <div 
              key={index} 
              className={`min-h-16 p-2 border rounded-lg ${
                dayData.isToday ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              data-testid={`calendar-day-${dayData.day}`}
            >
              <div className="text-sm font-medium text-card-foreground mb-1">
                {dayData.day}
              </div>
              {dayData.minutes && (
                <div className="text-xs text-muted-foreground mb-1">
                  {dayData.minutes}m
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {dayData.rounds?.map((round, i) => (
                  <Badge 
                    key={i} 
                    className={`text-xs px-1 py-0 ${roundColors[round as keyof typeof roundColors]}`}
                    data-testid={`badge-round-${round}`}
                  >
                    {round}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}