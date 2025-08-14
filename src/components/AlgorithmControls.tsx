import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SortingAlgorithm } from '@/types/algorithm';
import { Play, Pause, RotateCcw, SkipForward, Shuffle } from 'lucide-react';

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
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-card rounded-lg border shadow-elegant">
      {/* Algorithm Selection */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Algorithm:</label>
        <Select value={algorithm} onValueChange={onAlgorithmChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bubble">Bubble Sort</SelectItem>
            <SelectItem value="merge">Merge Sort</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="control"
          size="icon"
          onClick={onGenerateArray}
          disabled={isPlaying}
          title="Generate New Array"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
        
        <Button
          variant="control"
          size="icon"
          onClick={onReset}
          disabled={isPlaying}
          title="Reset to Start"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        {isPlaying ? (
          <Button
            variant="stop"
            size="icon"
            onClick={onPause}
            title="Pause"
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="play"
            size="icon"
            onClick={onPlay}
            disabled={currentStep >= totalSteps - 1}
            title="Play"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="control"
          size="icon"
          onClick={onStep}
          disabled={isPlaying || currentStep >= totalSteps - 1}
          title="Step Forward"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <label className="text-sm font-medium">Speed:</label>
        <Slider
          value={[speed]}
          onValueChange={([value]) => onSpeedChange(value)}
          min={50}
          max={1000}
          step={50}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8">
          {speed}ms
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
};