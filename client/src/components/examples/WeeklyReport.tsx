import WeeklyReport from '../WeeklyReport';

export default function WeeklyReportExample() {
  // todo: remove mock functionality
  return (
    <div className="p-4">
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
}