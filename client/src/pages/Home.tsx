import { useState } from "react";
import Header from "@/components/Header";
import RoundCard from "@/components/RoundCard";
import GoalsCard from "@/components/GoalsCard";
import PracticeCalendar from "@/components/PracticeCalendar";
import ScoreCard from "@/components/ScoreCard";
import WeeklyReport from "@/components/WeeklyReport";
import ProblemInterface from "@/components/ProblemInterface";
import PracticeSession from "@/components/PracticeSession";
import TeamRoleCard from "@/components/TeamRoleCard";
import ProblemBankManager from "@/components/ProblemBankManager";
import ParentDashboard from "@/components/ParentDashboard";

type ViewType = 'home' | 'practice' | 'calendar' | 'scores' | 'reports' | 'problem-bank' | 'parent';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedRoundType, setSelectedRoundType] = useState<'sprint' | 'target' | 'numbersense' | 'team' | null>(null);
  
  // todo: remove mock functionality
  const mockGoals = [
    { title: "Composite to 180", current: 156, target: 180, color: "blue" },
    { title: "Sprint accuracy 75%", current: 68, target: 75, color: "orange" },
    { title: "Target solved per pair ≥1.0", current: 0.8, target: 1.0, color: "green" }
  ];
  
  const mockCalendarDays = [
    { day: 1, minutes: 15, rounds: ['NS'], isToday: false },
    { day: 2, minutes: 20, rounds: ['SP'], isToday: false },
    { day: 3, minutes: 10, rounds: ['TG'], isToday: false },
    { day: 4, minutes: 15, rounds: ['NS'], isToday: false },
    { day: 5, minutes: 25, rounds: ['TM', 'SP'], isToday: true },
    { day: 6 }, { day: 7 }, { day: 8 },
    { day: 9, minutes: 15, rounds: ['NS'] },
    { day: 10, minutes: 30, rounds: ['TG'] },
    { day: 11 }, { day: 12 }, { day: 13, minutes: 15, rounds: ['NS'] },
    { day: 14 }, { day: 15, minutes: 20, rounds: ['SP'] },
    { day: 16, minutes: 15, rounds: ['NS'] },
    { day: 17 }, { day: 18, minutes: 10, rounds: ['TG'] },
    { day: 19, minutes: 15, rounds: ['NS'] },
    { day: 20 }, { day: 21, minutes: 25, rounds: ['TM'] },
    { day: 22, minutes: 15, rounds: ['NS'] },
    { day: 23 }, { day: 24, minutes: 10, rounds: ['TG'] },
    { day: 25, minutes: 15, rounds: ['NS'] },
    { day: 26, minutes: 30, rounds: ['TG'] },
    { day: 27 }, { day: 28, minutes: 15, rounds: ['NS'] },
    { day: 29 }, { day: 30, minutes: 20, rounds: ['SP'] }
  ];
  
  const mockProblemMC = {
    id: '1',
    text: 'Q1. Simplify 18/24.',
    choices: ['2/3', '4/5', '5/8', '3/4'],
    type: 'multiple_choice' as const
  };
  
  const mockProblems = [
    {
      id: 'P-1021',
      type: 'Sprint',
      prompt: 'Simplify 18/24.',
      answer: '2/3',
      tags: ['fractions']
    },
    {
      id: 'P-1033', 
      type: 'Target',
      prompt: 'Two integers sum to 55. Larger?',
      answer: '28',
      tags: ['algebra']
    },
    {
      id: 'P-0930',
      type: 'NS',
      prompt: '54 ÷ 0.9',
      answer: '60', 
      tags: ['mental math']
    },
    {
      id: 'P-0891',
      type: 'Team',
      prompt: 'Triangle area with base 8, height 5',
      answer: '20',
      tags: ['geometry']
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Let's practice!</h2>
                  <p className="text-muted-foreground mb-6">Pick a round or start a quick session.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RoundCard
                      title="Number Sense"
                      description="10 min • mental math"
                      duration="10 min"
                      calcAllowed={false}
                      color="green"
                      onClick={() => {
                        setSelectedRoundType('numbersense');
                        setCurrentView('practice');
                      }}
                    />
                    <RoundCard
                      title="Sprint"
                      description="40 min • 30 MC"
                      duration="40 min"
                      calcAllowed={false}
                      color="orange"
                      onClick={() => {
                        console.log('Sprint button clicked - setting roundType to sprint');
                        setSelectedRoundType('sprint');
                        setCurrentView('practice');
                      }}
                    />
                    <RoundCard
                      title="Target"
                      description="4 pairs x 6 min"
                      duration="24 min"
                      calcAllowed={true}
                      color="blue"
                      onClick={() => {
                        setSelectedRoundType('target');
                        setCurrentView('practice');
                      }}
                    />
                    <RoundCard
                      title="Team"
                      description="20 min • 10 problems"
                      duration="20 min"
                      calcAllowed={true}
                      color="purple"
                      onClick={() => {
                        setSelectedRoundType('team');
                        setCurrentView('practice');
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <GoalsCard goals={mockGoals} />
              </div>
            </div>
          </div>
        );
        
      case 'practice':
        if (!selectedRoundType) {
          setCurrentView('home');
          return null;
        }
        
        console.log('Rendering PracticeSession with roundType:', selectedRoundType);
        return (
          <PracticeSession
            studentId={"demo-student-id"} // In real app, get from auth context
            roundType={selectedRoundType}
            onComplete={(results) => {
              console.log('Session completed:', results);
              // Show results or redirect
              setSelectedRoundType(null);
              setCurrentView('home');
            }}
            onCancel={() => {
              setSelectedRoundType(null);
              setCurrentView('home');
            }}
          />
        );
        
      case 'calendar':
        return (
          <div className="space-y-6">
            <PracticeCalendar month="Practice Calendar" days={mockCalendarDays} />
          </div>
        );
        
      case 'scores':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Session Score Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard title="Sprint" score={76} maxScore={120} color="blue" />
              <ScoreCard title="Target" score={40} maxScore={80} color="yellow" />
              <ScoreCard title="Number Sense (raw)" score={60} maxScore={100} color="purple" />
              <ScoreCard 
                title="Composite" 
                score={176} 
                maxScore={300} 
                color="green"
                subtitle="Ties break by Sprint, then Target (item analysis). Practice uses official Mathleague rules."
              />
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Weekly Report</h2>
            <WeeklyReport
              totalMinutes={186}
              weeklyGoal={75}
              weekChange={6}
              projectedScore={186}
              targetScore={200}
              weeksToMeet={4}
              status="on-track"
            />
          </div>
        );
        
      case 'problem-bank':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Problem Bank — Upload & Manage</h2>
            <ProblemBankManager 
              problems={mockProblems}
              onAddProblem={(problem) => console.log('New problem:', problem)}
            />
          </div>
        );
        
      case 'parent':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Parent View — On-pace</h2>
            <ParentDashboard
              childName="Alex"
              compositeScore={186}
              targetScore={300}
              onSettingChange={(setting, value) => console.log(`${setting}: ${value}`)}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'practice', label: 'Practice' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'scores', label: 'Scores' },
    { key: 'reports', label: 'Reports' },
    { key: 'problem-bank', label: 'Problem Bank' },
    { key: 'parent', label: 'Parent View' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation */}
      <nav className="bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 py-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as ViewType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate ${
                  currentView === item.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-card-foreground'
                }`}
                data-testid={`nav-${item.key}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}