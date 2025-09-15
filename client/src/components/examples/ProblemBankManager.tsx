import ProblemBankManager from '../ProblemBankManager';

export default function ProblemBankManagerExample() {
  // todo: remove mock functionality
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

  return (
    <div className="p-4">
      <ProblemBankManager 
        problems={mockProblems}
        onAddProblem={(problem) => console.log('New problem:', problem)}
      />
    </div>
  );
}