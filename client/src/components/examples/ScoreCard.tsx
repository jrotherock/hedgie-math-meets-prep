import ScoreCard from '../ScoreCard';

export default function ScoreCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <ScoreCard
        title="Sprint"
        score={76}
        maxScore={120}
        color="blue"
      />
      <ScoreCard
        title="Target"
        score={40}
        maxScore={80}
        color="yellow"
      />
      <ScoreCard
        title="Number Sense (raw)"
        score={60}
        maxScore={100}
        color="purple"
      />
      <ScoreCard
        title="Composite"
        score={176}
        maxScore={300}
        color="green"
        subtitle="Ties break by Sprint, then Target (item analysis). Practice uses official Mathleague rules."
      />
    </div>
  );
}