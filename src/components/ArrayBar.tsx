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
    <div className="flex flex-col items-center gap-4 min-w-[45px] animate-fade-in">
      <div
        className={getBarClasses()}
        style={{ 
          height: `${height}px`, 
          width: '100%',
          minHeight: '40px'
        }}
        title={`Value: ${element.value}, Position: ${index}`}
      >
        <span className="text-sm font-bold text-white mb-3 drop-shadow-xl select-none z-10 relative">
          {element.value}
        </span>
        
        {/* Premium shimmer effect */}
        {element.state !== 'default' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        )}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-muted-foreground font-mono bg-muted/20 px-3 py-1.5 rounded-lg border border-border/20 backdrop-blur-sm">
          {index}
        </span>
        {element.state !== 'default' && (
          <div className="w-4 h-2 rounded-full bg-gradient-to-r from-primary to-primary-glow animate-pulse shadow-glow" />
        )}
      </div>
    </div>
  );
};