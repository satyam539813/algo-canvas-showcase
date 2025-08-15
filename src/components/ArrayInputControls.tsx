import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings2, Upload, Download, RefreshCw } from 'lucide-react';
import { ArrayElement } from '@/types/algorithm';
import { toast } from '@/hooks/use-toast';

interface ArrayInputControlsProps {
  arraySize: number;
  minValue: number;
  maxValue: number;
  onArraySizeChange: (size: number) => void;
  onMinValueChange: (min: number) => void;
  onMaxValueChange: (max: number) => void;
  onCustomArraySubmit: (array: number[]) => void;
  onGenerateArray: () => void;
  isPlaying: boolean;
}

export const ArrayInputControls = ({
  arraySize,
  minValue,
  maxValue,
  onArraySizeChange,
  onMinValueChange,
  onMaxValueChange,
  onCustomArraySubmit,
  onGenerateArray,
  isPlaying,
}: ArrayInputControlsProps) => {
  const [customInput, setCustomInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCustomArraySubmit = () => {
    try {
      const numbers = customInput
        .split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));
      
      if (numbers.length === 0) {
        toast({
          title: "Invalid Input",
          description: "Please enter valid comma-separated numbers.",
          variant: "destructive",
        });
        return;
      }

      if (numbers.length > 50) {
        toast({
          title: "Too Many Elements",
          description: "Maximum 50 elements allowed.",
          variant: "destructive",
        });
        return;
      }

      onCustomArraySubmit(numbers);
      setCustomInput('');
      toast({
        title: "Array Updated",
        description: `Custom array with ${numbers.length} elements loaded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse the input. Please check your format.",
        variant: "destructive",
      });
    }
  };

  const generatePreset = (type: 'ascending' | 'descending' | 'random' | 'nearly-sorted') => {
    const size = arraySize;
    let numbers: number[] = [];

    switch (type) {
      case 'ascending':
        numbers = Array.from({ length: size }, (_, i) => minValue + i);
        break;
      case 'descending':
        numbers = Array.from({ length: size }, (_, i) => maxValue - i);
        break;
      case 'nearly-sorted':
        numbers = Array.from({ length: size }, (_, i) => minValue + i);
        // Swap a few random elements
        for (let i = 0; i < Math.floor(size * 0.1); i++) {
          const a = Math.floor(Math.random() * size);
          const b = Math.floor(Math.random() * size);
          [numbers[a], numbers[b]] = [numbers[b], numbers[a]];
        }
        break;
      default:
        numbers = Array.from({ length: size }, () => 
          Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        );
    }

    onCustomArraySubmit(numbers);
    toast({
      title: "Preset Loaded",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} array generated.`,
    });
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            <Settings2 className="h-5 w-5 text-primary animate-pulse" />
            Array Configuration
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs hover:bg-primary/20 transition-colors"
          >
            {showAdvanced ? 'Basic' : 'Advanced'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Array Size</Label>
            <div className="space-y-2">
              <Slider
                value={[arraySize]}
                onValueChange={([value]) => onArraySizeChange(value)}
                min={5}
                max={50}
                step={1}
                disabled={isPlaying}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5</span>
                <Badge variant="secondary" className="text-xs">
                  {arraySize}
                </Badge>
                <span>50</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Value</Label>
            <Input
              type="number"
              value={minValue}
              onChange={(e) => onMinValueChange(parseInt(e.target.value) || 1)}
              min={1}
              max={maxValue - 1}
              disabled={isPlaying}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Value</Label>
            <Input
              type="number"
              value={maxValue}
              onChange={(e) => onMaxValueChange(parseInt(e.target.value) || 100)}
              min={minValue + 1}
              max={500}
              disabled={isPlaying}
              className="w-full"
            />
          </div>
        </div>

        {/* Preset Arrays */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generatePreset('random')}
              disabled={isPlaying}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Random
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generatePreset('ascending')}
              disabled={isPlaying}
              className="text-xs"
            >
              Ascending
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generatePreset('descending')}
              disabled={isPlaying}
              className="text-xs"
            >
              Descending
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generatePreset('nearly-sorted')}
              disabled={isPlaying}
              className="text-xs"
            >
              Nearly Sorted
            </Button>
          </div>
        </div>

        {/* Advanced Controls */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label className="text-sm font-medium">Custom Array Input</Label>
              <div className="space-y-3">
                <Input
                  placeholder="Enter comma-separated numbers (e.g., 64, 34, 25, 12, 22, 11, 90)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={isPlaying}
                  className="w-full input-glow transition-all duration-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInput.trim() && !isPlaying) {
                      handleCustomArraySubmit();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomArraySubmit}
                    disabled={!customInput.trim() || isPlaying}
                    size="sm"
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Load Custom Array
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter up to 50 numbers separated by commas. Invalid numbers will be ignored.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};