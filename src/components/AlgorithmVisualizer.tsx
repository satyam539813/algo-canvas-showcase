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
    <div className="min-h-screen bg-background relative">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary))_0.1px,transparent_0.1px)] opacity-10" 
           style={{ backgroundSize: '80px 80px' }} />
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Premium Header */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1 space-y-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Algorithm Visualizer
              </h1>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
                Experience the elegance of sorting algorithms with premium visualization and refined interactions
              </p>
            </div>
            <div className="absolute top-8 right-8">
              <ThemeToggle />
            </div>
          </div>

          {/* Premium Array Input Controls */}
          <div className="glass-effect rounded-2xl p-8 shadow-premium border border-border/30">
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
          </div>

          {/* Premium Algorithm Info & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-effect rounded-2xl p-8 shadow-premium border border-border/30">
              <AlgorithmInfo 
                algorithm={algorithm} 
                description={currentDescription}
              />
            </div>
            <div className="glass-effect rounded-2xl p-8 shadow-premium border border-border/30">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={steps.length}
                algorithm={algorithm}
                isPlaying={isPlaying}
                speed={speed}
              />
            </div>
          </div>

          {/* Premium Visualization */}
          <div className="glass-effect rounded-2xl p-8 shadow-premium border border-border/30">
            <ArrayVisualization 
              array={array} 
              className="animate-fade-in"
            />
          </div>

          {/* Premium Controls */}
          <div className="glass-effect rounded-2xl p-8 shadow-premium border border-border/30">
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
          </div>

          {/* Premium Legend */}
          <div className="glass-effect rounded-2xl p-8 shadow-premium border border-border/30">
            <h3 className="font-bold mb-8 text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Color Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 transition-premium hover:bg-muted/20 hover:scale-105">
                <div className="w-8 h-8 array-bar rounded-lg shadow-lg"></div>
                <span className="font-semibold text-lg">Default</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 transition-premium hover:bg-muted/20 hover:scale-105">
                <div className="w-8 h-8 array-bar-comparing rounded-lg"></div>
                <span className="font-semibold text-lg">Comparing</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 transition-premium hover:bg-muted/20 hover:scale-105">
                <div className="w-8 h-8 array-bar-swapping rounded-lg"></div>
                <span className="font-semibold text-lg">Swapping</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 transition-premium hover:bg-muted/20 hover:scale-105">
                <div className="w-8 h-8 array-bar-sorted rounded-lg"></div>
                <span className="font-semibold text-lg">Sorted</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/10 transition-premium hover:bg-muted/20 hover:scale-105">
                <div className="w-8 h-8 array-bar-pivot rounded-lg"></div>
                <span className="font-semibold text-lg">Pivot/Merge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};