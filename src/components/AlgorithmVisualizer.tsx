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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-muted/20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-primary/10" />
      <div className="absolute inset-0 particle-bg opacity-30" />
      
      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] opacity-20" 
           style={{ backgroundSize: '60px 60px' }} />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 gradient-cyber rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 gradient-neon rounded-full blur-2xl opacity-15 animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1 space-y-4">
              <h1 className="text-6xl font-bold gradient-neon bg-clip-text text-transparent animate-cyber-glow">
                Algorithm Visualizer
              </h1>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
                Experience the beauty of sorting algorithms with stunning real-time visualization and modern UI
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

          {/* Enhanced Visualization */}
          <div className="relative">
            <div className="absolute inset-0 gradient-cyber rounded-2xl blur-xl opacity-20 animate-pulse-glow" />
            <ArrayVisualization 
              array={array} 
              className="relative animate-fade-in shadow-neon bg-card/30 backdrop-blur-sm border border-primary/20"
            />
          </div>

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

          {/* Enhanced Legend */}
          <div className="relative">
            <div className="absolute inset-0 gradient-secondary rounded-2xl blur-lg opacity-50" />
            <div className="relative bg-card/40 backdrop-blur-md p-8 rounded-2xl border border-primary/30 shadow-neon">
              <h3 className="font-bold mb-6 text-xl gradient-primary bg-clip-text text-transparent">Color Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 transition-all hover:bg-muted/40">
                  <div className="w-6 h-6 array-bar rounded-lg shadow-lg"></div>
                  <span className="font-semibold">Default</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 transition-all hover:bg-muted/40">
                  <div className="w-6 h-6 array-bar-comparing rounded-lg"></div>
                  <span className="font-semibold">Comparing</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 transition-all hover:bg-muted/40">
                  <div className="w-6 h-6 array-bar-swapping rounded-lg"></div>
                  <span className="font-semibold">Swapping</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 transition-all hover:bg-muted/40">
                  <div className="w-6 h-6 array-bar-sorted rounded-lg"></div>
                  <span className="font-semibold">Sorted</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 transition-all hover:bg-muted/40">
                  <div className="w-6 h-6 array-bar-pivot rounded-lg"></div>
                  <span className="font-semibold">Pivot/Merge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};