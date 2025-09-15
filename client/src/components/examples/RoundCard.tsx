import RoundCard from '../RoundCard';

export default function RoundCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <RoundCard
        title="Number Sense"
        description="10 min • mental math"
        duration="10 min"
        calcAllowed={false}
        color="green"
        onClick={() => console.log('Number Sense clicked')}
      />
      <RoundCard
        title="Sprint"
        description="40 min • 30 MC"
        duration="40 min"
        calcAllowed={false}
        color="orange"
        onClick={() => console.log('Sprint clicked')}
      />
      <RoundCard
        title="Target"
        description="4 pairs x 6 min"
        duration="24 min"
        calcAllowed={true}
        color="blue"
        onClick={() => console.log('Target clicked')}
      />
      <RoundCard
        title="Team"
        description="20 min • 10 problems"
        duration="20 min"
        calcAllowed={true}
        color="purple"
        onClick={() => console.log('Team clicked')}
      />
    </div>
  );
}