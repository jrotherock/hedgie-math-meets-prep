import { Button } from "@/components/ui/button";
import hedgehogImage from "@assets/generated_images/Hedgehog_teacher_character_ad6d59a4.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-card border-b border-card-border">
      <div className="flex items-center gap-3">
        <img 
          src={hedgehogImage} 
          alt="Hedgie Math Coach" 
          className="w-10 h-10 rounded-full"
          data-testid="hedgehog-logo"
        />
        <div>
          <h1 className="text-lg font-bold text-foreground">Hedgie Math Meets Prep</h1>
          <p className="text-sm text-muted-foreground">A meet-prep coach with built-in tutoring</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" data-testid="button-settings">
          Settings
        </Button>
        <Button variant="outline" size="sm" data-testid="button-parent-view">
          Parent View
        </Button>
      </div>
    </header>
  );
}