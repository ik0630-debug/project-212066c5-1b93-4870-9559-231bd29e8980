import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface SwipeIndicatorProps {
  direction: 'left' | 'right' | null;
  progress: number;
  nextPageName?: string;
}

const SwipeIndicator = ({ direction, progress, nextPageName }: SwipeIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(direction !== null && progress > 0);
  }, [direction, progress]);

  if (!isVisible) return null;

  const opacity = Math.min(progress / 100, 1);
  const scale = 0.8 + (Math.min(progress / 100, 1) * 0.2);

  return (
    <>
      {/* Left indicator */}
      {direction === 'left' && (
        <div 
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{ 
            opacity,
            transform: `translateY(-50%) scale(${scale})`,
            transition: 'all 0.1s ease-out'
          }}
        >
          <div className="flex flex-col items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-2xl px-6 py-4 shadow-2xl border border-primary-foreground/20">
            <ChevronRight className="w-8 h-8" strokeWidth={3} />
            {nextPageName && (
              <span className="text-sm font-semibold whitespace-nowrap">{nextPageName}</span>
            )}
          </div>
        </div>
      )}

      {/* Right indicator */}
      {direction === 'right' && (
        <div 
          className="fixed left-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          style={{ 
            opacity,
            transform: `translateY(-50%) scale(${scale})`,
            transition: 'all 0.1s ease-out'
          }}
        >
          <div className="flex flex-col items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-2xl px-6 py-4 shadow-2xl border border-primary-foreground/20">
            <ChevronLeft className="w-8 h-8" strokeWidth={3} />
            {nextPageName && (
              <span className="text-sm font-semibold whitespace-nowrap">{nextPageName}</span>
            )}
          </div>
        </div>
      )}

      {/* Progress bar at bottom */}
      <div 
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        style={{ opacity }}
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-border">
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100 ease-out rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SwipeIndicator;
