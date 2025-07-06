import { useState, useEffect } from 'react';

interface RosaryBeadsProps {
  completed: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  onBeadClick?: (index: number) => void;
  animated?: boolean;
}

export default function RosaryBeads({ 
  completed, 
  total, 
  size = 'md',
  onBeadClick,
  animated = true
}: RosaryBeadsProps) {
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const beadSize = sizeClasses[size];

  // Animate bead completion with staggered timing
  useEffect(() => {
    if (!animated) {
      setAnimatedCompleted(completed);
      return;
    }

    if (completed !== animatedCompleted) {
      setIsAnimating(true);
      
      if (completed > animatedCompleted) {
        // Animate forward - complete beads one by one
        let current = animatedCompleted;
        const interval = setInterval(() => {
          current++;
          setAnimatedCompleted(current);
          
          if (current >= completed) {
            clearInterval(interval);
            setIsAnimating(false);
          }
        }, 200); // 200ms delay between each bead
        
        return () => clearInterval(interval);
      } else {
        // Animate backward - reset beads instantly for section changes
        setAnimatedCompleted(completed);
        setIsAnimating(false);
      }
    }
  }, [completed, animatedCompleted, animated]);

  const getBeadState = (index: number) => {
    if (index < animatedCompleted) return 'completed';
    if (index === animatedCompleted && isAnimating) return 'completing';
    if (index === animatedCompleted && !isAnimating && animatedCompleted < total) return 'current';
    return 'pending';
  };

  const getBeadClasses = (index: number, state: string) => {
    const baseClasses = `${beadSize} rounded-full transition-all duration-500 ease-in-out transform prayer-bead-enhanced`;
    const interactiveClasses = onBeadClick ? 'cursor-pointer sacred-bead-hover' : '';
    
    switch (state) {
      case 'completed':
        return `${baseClasses} ${interactiveClasses} prayer-bead-completed animate-bead-glow completed`;
      case 'completing':
        return `${baseClasses} ${interactiveClasses} prayer-bead-completing animate-bead-complete scale-125`;
      case 'current':
        return `${baseClasses} ${interactiveClasses} prayer-bead-current animate-pulse-gentle`;
      default:
        return `${baseClasses} ${interactiveClasses} prayer-bead-pending`;
    }
  };

  return (
    <div className={`flex justify-center items-center py-2 ${size === 'sm' ? 'space-x-1.5' : 'space-x-2'}`}>
      {Array.from({ length: total }).map((_, index) => {
        const state = getBeadState(index);
        return (
          <div
            key={index}
            className={getBeadClasses(index, state)}
            onClick={() => onBeadClick?.(index)}
            style={{
              animationDelay: state === 'completing' ? '0ms' : `${index * 100}ms`
            }}
          >
            {/* Inner glow effect for completed beads */}
            {state === 'completed' && (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--ancient-gold-bright)] to-[var(--byzantine-gold)] opacity-80 animate-inner-glow" />
            )}
            
            {/* Pulsing center for current bead */}
            {state === 'current' && (
              <div className="w-2 h-2 mx-auto mt-0.5 rounded-full bg-[var(--ancient-gold)] animate-ping opacity-75" />
            )}
            
            {/* Cross symbol for completed beads */}
            {state === 'completed' && size !== 'sm' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[var(--cathedral-void)] text-xs font-bold">✠</span>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Progress text */}
      {size === 'lg' && (
        <div className="ml-4 text-sm font-inter text-parchment/70">
          <span className="text-ancient-gold font-medium">{animatedCompleted}</span>
          <span className="mx-1">/</span>
          <span>{total}</span>
        </div>
      )}
    </div>
  );
}
