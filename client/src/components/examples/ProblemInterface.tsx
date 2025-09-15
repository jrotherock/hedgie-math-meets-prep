import ProblemInterface from '../ProblemInterface';

export default function ProblemInterfaceExample() {
  // todo: remove mock functionality
  const mockProblemMC = {
    id: '1',
    text: 'Q1. Simplify 18/24.',
    choices: ['2/3', '4/5', '5/8', '3/4'],
    type: 'multiple_choice' as const
  };

  const mockProblemNum = {
    id: '2', 
    text: 'Q8. 54 ÷ 0.9 = ?',
    type: 'numerical' as const
  };

  return (
    <div className="space-y-6 p-4">
      <ProblemInterface
        roundType="sprint"
        problem={mockProblemMC}
        onAnswer={(answer) => console.log('Sprint answer:', answer)}
        showHint={true}
      />
      
      <ProblemInterface
        roundType="numbersense"
        problem={mockProblemNum}
        onAnswer={(answer) => console.log('Number Sense answer:', answer)}
        showHint={false}
      />
    </div>
  );
}