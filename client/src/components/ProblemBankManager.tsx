import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Problem {
  id: string;
  type: string;
  prompt: string;
  answer: string;
  tags: string[];
}

interface ProblemBankManagerProps {
  problems: Problem[];
  onAddProblem?: (problem: Partial<Problem>) => void;
}

export default function ProblemBankManager({ problems, onAddProblem }: ProblemBankManagerProps) {
  const [newProblem, setNewProblem] = useState({
    type: '',
    prompt: '',
    answer: '',
    tags: '',
    source: '',
    difficulty: ''
  });

  const handleAddProblem = () => {
    onAddProblem?.({
      ...newProblem,
      tags: newProblem.tags.split(',').map(tag => tag.trim())
    });
    console.log('Adding problem:', newProblem);
    setNewProblem({ type: '', prompt: '', answer: '', tags: '', source: '', difficulty: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="problem-bank-manager">
      <Card data-testid="card-add-problems">
        <CardHeader>
          <CardTitle>Add new problems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-card-foreground">Type</label>
            <Select onValueChange={(value) => setNewProblem({...newProblem, type: value})}>
              <SelectTrigger data-testid="select-problem-type">
                <SelectValue placeholder="Number Sense / Sprint / Target / Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number-sense">Number Sense</SelectItem>
                <SelectItem value="sprint">Sprint</SelectItem>
                <SelectItem value="target">Target</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-card-foreground">Source</label>
            <Input 
              placeholder="Book page / PDF / URL / Manual"
              value={newProblem.source}
              onChange={(e) => setNewProblem({...newProblem, source: e.target.value})}
              data-testid="input-source"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-card-foreground">Difficulty</label>
            <Input 
              placeholder="1-5"
              value={newProblem.difficulty}
              onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value})}
              data-testid="input-difficulty"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-card-foreground">Topic tags</label>
            <Input 
              placeholder="fractions, ratios, geometry..."
              value={newProblem.tags}
              onChange={(e) => setNewProblem({...newProblem, tags: e.target.value})}
              data-testid="input-tags"
            />
          </div>
          
          <div className="border rounded-lg p-4 min-h-24 bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Drag & drop images/PDFs or paste text</p>
            <Input 
              placeholder="Problem text..."
              value={newProblem.prompt}
              onChange={(e) => setNewProblem({...newProblem, prompt: e.target.value})}
              data-testid="input-problem-text"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              data-testid="button-upload"
              onClick={() => console.log('Upload clicked')}
            >
              Upload
            </Button>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleAddProblem}
              disabled={!newProblem.type || !newProblem.prompt}
              data-testid="button-add-problem"
            >
              Add
            </Button>
            <Button 
              variant="outline" 
              data-testid="button-save-draft"
              onClick={() => console.log('Save draft clicked')}
            >
              Save draft
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card data-testid="card-problems-list">
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {problems.map((problem) => (
              <div 
                key={problem.id} 
                className="border rounded-lg p-3 hover-elevate cursor-pointer"
                data-testid={`problem-item-${problem.id}`}
                onClick={() => console.log('Problem selected:', problem.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{problem.id}</span>
                    <Badge variant="outline">{problem.type}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{problem.answer}</span>
                </div>
                <p className="text-sm text-card-foreground truncate">{problem.prompt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {problem.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}