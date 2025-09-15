import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ParentDashboardProps {
  childName: string;
  compositeScore: number;
  targetScore: number;
  onSettingChange?: (setting: string, value: boolean) => void;
}

export default function ParentDashboard({ childName, compositeScore, targetScore, onSettingChange }: ParentDashboardProps) {
  const [settings, setSettings] = useState({
    kidMode: true,
    timerBeeps: false, 
    hintLadder: true,
    manualEntry: true,
    dailyGoal: true
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({...prev, [setting]: value}));
    onSettingChange?.(setting, value);
    console.log(`Setting ${setting} changed to:`, value);
  };

  return (
    <div className="space-y-6" data-testid="parent-dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="card-progress">
          <CardHeader>
            <CardTitle>Progress toward Meet #1</CardTitle>
            <p className="text-sm text-muted-foreground">
              Composite {compositeScore} / {targetScore}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={(compositeScore / targetScore) * 100}
              className="h-4"
              data-testid="progress-composite"
            />
            
            <div className="space-y-3">
              {[
                { name: 'Sprint accuracy 76%', value: 76 },
                { name: 'Target solved per pair 1.1', value: 55 },
                { name: 'Number Sense avg +72', value: 72 }
              ].map((metric, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-card-foreground">{metric.name}</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <Badge className="bg-green-100 text-green-800" data-testid="badge-status">
                On Track
              </Badge>
              <span className="text-sm text-muted-foreground">
                Need +2.0/wk • Doing +3.1/wk
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="card-session-settings">
          <CardHeader>
            <CardTitle>Session Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'kidMode', label: 'Kid Mode (big buttons)', value: settings.kidMode },
              { key: 'timerBeeps', label: 'Timer beeps', value: settings.timerBeeps },
              { key: 'hintLadder', label: 'Hint ladder (3 steps)', value: settings.hintLadder },
              { key: 'manualEntry', label: 'Manual entry (personal use)', value: settings.manualEntry },
              { key: 'dailyGoal', label: 'Daily goal: 15 min', value: settings.dailyGoal }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <label className="text-sm text-card-foreground cursor-pointer">
                  {setting.label}
                </label>
                <Switch
                  checked={setting.value}
                  onCheckedChange={(value) => handleSettingChange(setting.key, value)}
                  data-testid={`switch-${setting.key}`}
                />
              </div>
            ))}
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-download-report"
                onClick={() => console.log('Download weekly report')}
              >
                Download weekly report (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}