import { useState, useEffect, useCallback } from 'react';
import { ArrayElement, SortingStep, SortingAlgorithm } from '@/types/algorithm';
import { generateRandomArray, bubbleSort, mergeSort } from '@/utils/sortingAlgorithms';
import { ArrayVisualization } from './ArrayVisualization';
import { AlgorithmControls } from './AlgorithmControls';
import { AlgorithmInfo } from './AlgorithmInfo';
import { ArrayInputControls } from './ArrayInputControls';
import { ProgressBar } from './ProgressBar';
import { ThemeToggle } from './ThemeToggle';

export const AlgorithmVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  
  // Array configuration state
  const [arraySize, setArraySize] = useState(15);
  const [minValue, setMinValue] = useState(5);
  const [maxValue, setMaxValue] = useState(100);

  // Initialize with random array
  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize, minValue, maxValue);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [arraySize, minValue, maxValue]);

  const handleCustomArray = useCallback((customNumbers: number[]) => {
    const newArray: ArrayElement[] = customNumbers.map((value, index) => ({
      value,
      id: `custom-${index}-${Date.now()}`,
      state: 'default'
    }));
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setArraySize(customNumbers.length);
  }, []);

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size);
    if (!isPlaying) {
      const newArray = generateRandomArray(size, minValue, maxValue);
      setArray(newArray);
      setSteps([]);
      setCurrentStep(0);
    }
  }, [minValue, maxValue, isPlaying]);

  const handleMinValueChange = useCallback((min: number) => {
    if (min < maxValue) {
      setMinValue(min);
      if (!isPlaying) {
        const newArray = generateRandomArray(arraySize, min, maxValue);
        setArray(newArray);
        setSteps([]);
        setCurrentStep(0);
      }
    }
  }, [maxValue, arraySize, isPlaying]);

  const handleMaxValueChange = useCallback((max: number) => {
    if (max > minValue) {
      setMaxValue(max);
      if (!isPlaying) {
        const newArray = generateRandomArray(arraySize, minValue, max);
        setArray(newArray);
        setSteps([]);
        setCurrentStep(0);
      }
    }
  }, [minValue, arraySize, isPlaying]);

  const runAlgorithm = useCallback(() => {
    const sortingSteps = algorithm === 'bubble' 
      ? bubbleSort(array) 
      : mergeSort(array);
    
    setSteps(sortingSteps);
    setCurrentStep(0);
    if (sortingSteps.length > 0) {
      setArray(sortingSteps[0].array);
    }
  }, [algorithm, array]);

  const handleAlgorithmChange = (newAlgorithm: SortingAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setIsPlaying(false);
    setSteps([]);
    setCurrentStep(0);
  };

  const handlePlay = () => {
    if (steps.length === 0) {
      runAlgorithm();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSteps([]);
    setCurrentStep(0);
    generateNewArray();
  };

  const handleStep = () => {
    if (steps.length === 0) {
      runAlgorithm();
      return;
    }
    
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setArray(steps[nextStep].array);
    }
  };

  // Auto-play effect
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setArray(steps[nextStep].array);
      } else {
        setIsPlaying(false);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  // Generate steps when algorithm changes and we have an array
  useEffect(() => {
    if (array.length > 0 && steps.length === 0) {
      const initialSteps = algorithm === 'bubble' 
        ? bubbleSort(array) 
        : mergeSort(array);
      setSteps(initialSteps);
    }
  }, [algorithm, array, steps.length]);

  const currentDescription = steps[currentStep]?.description || '';

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary))_0.1px,transparent_0.1px)] opacity-20" 
           style={{ backgroundSize: '50px 50px' }} />
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1 space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent-foreground bg-clip-text text-transparent">
                Algorithm Visualizer
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Watch sorting algorithms in action with beautiful real-time visualization
              </p>
            </div>
            <div className="absolute top-6 right-6">
              <ThemeToggle />
            </div>
          </div>

          {/* Array Input Controls */}
          <ArrayInputControls
            arraySize={arraySize}
            minValue={minValue}
            maxValue={maxValue}
            onArraySizeChange={handleArraySizeChange}
            onMinValueChange={handleMinValueChange}
            onMaxValueChange={handleMaxValueChange}
            onCustomArraySubmit={handleCustomArray}
            onGenerateArray={generateNewArray}
            isPlaying={isPlaying}
          />

          {/* Algorithm Info & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlgorithmInfo 
              algorithm={algorithm} 
              description={currentDescription}
            />
            <ProgressBar
              currentStep={currentStep}
              totalSteps={steps.length}
              algorithm={algorithm}
              isPlaying={isPlaying}
              speed={speed}
            />
          </div>

          {/* Visualization */}
          <ArrayVisualization 
            array={array} 
            className="animate-fade-in shadow-elegant"
          />

          {/* Controls */}
          <AlgorithmControls
            algorithm={algorithm}
            isPlaying={isPlaying}
            speed={speed}
            currentStep={currentStep}
            totalSteps={steps.length}
            onAlgorithmChange={handleAlgorithmChange}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStep={handleStep}
            onSpeedChange={setSpeed}
            onGenerateArray={generateNewArray}
          />

          {/* Legend */}
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-elegant">
            <h3 className="font-semibold mb-4 text-lg">Color Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 array-bar rounded-md border border-border/20"></div>
                <span className="font-medium">Default</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 array-bar-comparing rounded-md"></div>
                <span className="font-medium">Comparing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 array-bar-swapping rounded-md"></div>
                <span className="font-medium">Swapping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 array-bar-sorted rounded-md"></div>
                <span className="font-medium">Sorted</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 array-bar-pivot rounded-md"></div>
                <span className="font-medium">Pivot/Merge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};