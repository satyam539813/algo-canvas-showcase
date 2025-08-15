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
    const baseClasses = "array-bar rounded-t-lg border border-border/20 relative flex items-end justify-center cursor-pointer";
    
    switch (element.state) {
      case 'comparing':
        return cn(baseClasses, "array-bar-comparing");
      case 'swapping':
        return cn(baseClasses, "array-bar-swapping");
      case 'sorted':
        return cn(baseClasses, "array-bar-sorted");
      case 'pivot':
        return cn(baseClasses, "array-bar-pivot");
      default:
        return cn(baseClasses, "hover:shadow-glow");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 min-w-[35px] animate-fade-in">
      <div
        className={getBarClasses()}
        style={{ 
          height: `${height}px`, 
          width: '100%',
          minHeight: '30px'
        }}
        title={`Value: ${element.value}, Position: ${index}`}
      >
        <span className="text-xs font-bold text-white mb-2 drop-shadow-lg select-none">
          {element.value}
        </span>
        
        {/* Shimmer effect for active bars */}
        {element.state !== 'default' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        )}
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
          {index}
        </span>
        {element.state !== 'default' && (
          <div className="w-2 h-1 rounded-full bg-primary animate-pulse" />
        )}
      </div>
    </div>
  );
};