import { SortingAlgorithm } from '@/types/algorithm';

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm;
  description: string;
}

const algorithmData = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Merge sort divides the array into halves, sorts them separately, and then merges the sorted halves back together.',
  },
};

export const AlgorithmInfo = ({ algorithm, description }: AlgorithmInfoProps) => {
  const info = algorithmData[algorithm];
  
  return (
    <div className="space-y-4">
      {/* Algorithm Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-primary mb-2">Algorithm</h3>
          <p className="text-lg font-bold">{info.name}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-primary mb-2">Time Complexity</h3>
          <p className="text-lg font-bold font-mono">{info.timeComplexity}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-semibold text-primary mb-2">Space Complexity</h3>
          <p className="text-lg font-bold font-mono">{info.spaceComplexity}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-card p-4 rounded-lg border">
        <h3 className="font-semibold text-primary mb-2">Description</h3>
        <p className="text-muted-foreground mb-2">{info.description}</p>
        {description && (
          <p className="text-sm font-medium text-foreground">
            Current Step: {description}
          </p>
        )}
      </div>
    </div>
  );
};