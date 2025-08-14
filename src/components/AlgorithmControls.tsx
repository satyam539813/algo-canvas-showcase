import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SortingAlgorithm } from '@/types/algorithm';
import { Play, Pause, RotateCcw, SkipForward, Shuffle, Timer, Zap } from 'lucide-react';

interface AlgorithmControlsProps {
  algorithm: SortingAlgorithm;
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStep: () => void;
  onSpeedChange: (speed: number) => void;
  onGenerateArray: () => void;
}

export const AlgorithmControls = ({
  algorithm,
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onAlgorithmChange,
  onPlay,
  onPause,
  onReset,
  onStep,
  onSpeedChange,
  onGenerateArray,
}: AlgorithmControlsProps) => {
  const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const isCompleted = currentStep >= totalSteps - 1;

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Algorithm Selection and Progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Algorithm:</label>
              <Select value={algorithm} onValueChange={onAlgorithmChange}>
                <SelectTrigger className="w-40 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover backdrop-blur-sm border-border/50">
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {totalSteps}
              </span>
              {isCompleted && (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Complete
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {totalSteps > 0 && (
            <div className="space-y-2">
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-muted/50"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Start</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
                <span>Sorted</span>
              </div>
            </div>
          )}

          {/* Main Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Generation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onGenerateArray}
                disabled={isPlaying}
                title="Generate New Random Array"
                className="bg-background/50 hover:bg-accent/50 border-border/50"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={onReset}
                disabled={isPlaying}
                title="Reset to Start"
                className="bg-background/50 hover:bg-accent/50 border-border/50"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-1">
              {isPlaying ? (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onPause}
                  title="Pause Animation"
                  className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-orange-500/30"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onPlay}
                  disabled={isCompleted}
                  title="Play Animation"
                  className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                onClick={onStep}
                disabled={isPlaying || isCompleted}
                title="Step Forward"
                className="bg-background/50 hover:bg-accent/50 border-border/50"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium">Animation Speed</label>
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <div className="space-y-2">
              <Slider
                value={[speed]}
                onValueChange={([value]) => onSpeedChange(value)}
                min={50}
                max={1000}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Fast (50ms)</span>
                <Badge variant="outline" className="text-xs">
                  {speed}ms
                </Badge>
                <span>Slow (1000ms)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};