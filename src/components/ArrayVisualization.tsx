import { ArrayElement } from '@/types/algorithm';
import { ArrayBar } from './ArrayBar';

interface ArrayVisualizationProps {
  array: ArrayElement[];
  className?: string;
}

export const ArrayVisualization = ({ array, className = "" }: ArrayVisualizationProps) => {
  const maxValue = Math.max(...array.map(el => el.value));
  
  return (
    <div className={`relative flex items-end justify-center gap-2 p-8 rounded-2xl border-2 border-primary/20 ${className}`}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-muted/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 gradient-neon rounded-b-2xl opacity-60" />
      
      {array.map((element, index) => (
        <ArrayBar
          key={element.id}
          element={element}
          maxValue={maxValue}
          index={index}
        />
      ))}
      
      {/* Reflection Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/5 to-transparent rounded-b-2xl pointer-events-none" />
    </div>
  );
};