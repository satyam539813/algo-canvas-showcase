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
    <div className="flex flex-col items-center gap-4 min-w-[40px] animate-fade-in">
      <div
        className={getBarClasses()}
        style={{ 
          height: `${height}px`, 
          width: '100%',
          minHeight: '35px'
        }}
        title={`Value: ${element.value}, Position: ${index}`}
      >
        <span className="text-xs font-bold text-white mb-2 drop-shadow-lg select-none z-10 relative">
          {element.value}
        </span>
        
        {/* Enhanced shimmer effect */}
        {element.state !== 'default' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse" />
          </>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono bg-muted/70 px-2 py-1 rounded-lg border border-border/30">
          {index}
        </span>
        {element.state !== 'default' && (
          <div className="w-3 h-1.5 rounded-full gradient-primary animate-pulse shadow-glow" />
        )}
      </div>
    </div>
  );
};