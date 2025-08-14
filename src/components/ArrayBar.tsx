import { ArrayElement } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface ArrayBarProps {
  element: ArrayElement;
  maxValue: number;
  index: number;
}

export const ArrayBar = ({ element, maxValue, index }: ArrayBarProps) => {
  const height = Math.max((element.value / maxValue) * 300, 20);
  
  const getBarClasses = () => {
    const baseClasses = "array-bar rounded-t-md border-2 border-transparent relative flex items-end justify-center transition-smooth";
    
    switch (element.state) {
      case 'comparing':
        return cn(baseClasses, "array-bar-comparing shadow-glow");
      case 'swapping':
        return cn(baseClasses, "array-bar-swapping shadow-glow transition-bounce");
      case 'sorted':
        return cn(baseClasses, "array-bar-sorted");
      case 'pivot':
        return cn(baseClasses, "array-bar-pivot shadow-glow");
      default:
        return baseClasses;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 min-w-[30px]">
      <div
        className={getBarClasses()}
        style={{ height: `${height}px`, width: '100%' }}
      >
        <span className="text-xs font-bold text-white mb-1 drop-shadow-md">
          {element.value}
        </span>
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {index}
      </span>
    </div>
  );
};