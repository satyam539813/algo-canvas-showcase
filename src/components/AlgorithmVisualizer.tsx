import { useState, useEffect, useCallback } from 'react';
import { ArrayElement, SortingStep, SortingAlgorithm } from '@/types/algorithm';
import { generateRandomArray, bubbleSort, mergeSort } from '@/utils/sortingAlgorithms';
import { ArrayVisualization } from './ArrayVisualization';
import { AlgorithmControls } from './AlgorithmControls';
import { AlgorithmInfo } from './AlgorithmInfo';

export const AlgorithmVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);

  // Initialize with random array
  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(15);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

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
    <div className="min-h-screen gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
            Algorithm Visualizer
          </h1>
          <p className="text-muted-foreground text-lg">
            Watch sorting algorithms in action with real-time visualization
          </p>
        </div>

        {/* Algorithm Info */}
        <AlgorithmInfo 
          algorithm={algorithm} 
          description={currentDescription}
        />

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
        <div className="bg-card p-4 rounded-lg border shadow-elegant">
          <h3 className="font-semibold mb-3">Color Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 array-bar rounded"></div>
              <span>Default</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 array-bar-comparing rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 array-bar-swapping rounded"></div>
              <span>Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 array-bar-sorted rounded"></div>
              <span>Sorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 array-bar-pivot rounded"></div>
              <span>Pivot/Merge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};