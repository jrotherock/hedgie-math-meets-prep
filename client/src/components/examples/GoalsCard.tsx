import GoalsCard from '../GoalsCard';

export default function GoalsCardExample() {
  // todo: remove mock functionality
  const mockGoals = [
    { title: "Composite to 180", current: 156, target: 180, color: "blue" },
    { title: "Sprint accuracy 75%", current: 68, target: 75, color: "orange" },
    { title: "Target solved per pair ≥1.0", current: 0.8, target: 1.0, color: "green" }
  ];

  return <GoalsCard goals={mockGoals} />;
}