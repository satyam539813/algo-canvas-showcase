import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Clock, BarChart3 } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  algorithm: string;
  isPlaying: boolean;
  speed: number;
}

export const ProgressBar = ({ 
  currentStep, 
  totalSteps, 
  algorithm, 
  isPlaying,
  speed 
}: ProgressBarProps) => {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const estimatedTime = totalSteps > 0 ? ((totalSteps - currentStep) * speed) / 1000 : 0;

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{currentStep}/{totalSteps} steps</span>
            {isPlaying && estimatedTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{estimatedTime.toFixed(1)}s remaining</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2 progress-bar"
          />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground capitalize">{algorithm} Sort</span>
            <span className="font-medium text-primary">{progress.toFixed(1)}%</span>
          </div>
        </div>
        
        {isPlaying && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>Sorting in progress...</span>
          </div>
        )}
      </div>
    </Card>
  );
};