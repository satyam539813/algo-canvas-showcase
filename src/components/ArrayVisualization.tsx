import { ArrayElement } from '@/types/algorithm';
import { ArrayBar } from './ArrayBar';

interface ArrayVisualizationProps {
  array: ArrayElement[];
  className?: string;
}

export const ArrayVisualization = ({ array, className = "" }: ArrayVisualizationProps) => {
  const maxValue = Math.max(...array.map(el => el.value));
  
  return (
    <div className={`flex items-end justify-center gap-1 p-6 bg-card rounded-lg border ${className}`}>
      {array.map((element, index) => (
        <ArrayBar
          key={element.id}
          element={element}
          maxValue={maxValue}
          index={index}
        />
      ))}
    </div>
  );
};