import { useState, useEffect } from 'react';
import RosaryBeads from './RosaryBeads';

interface RosaryProgressTrackerProps {
  section: string;
  progress: Record<string, number>;
  onProgressUpdate: (section: string, completed: number) => void;
  currentSubSection?: number;
}

export default function RosaryProgressTracker({ 
  section, 
  progress, 
  onProgressUpdate,
  currentSubSection = 0
}: RosaryProgressTrackerProps) {
  const [animationKey, setAnimationKey] = useState(0);
  
  const isMysterySection = ['gaudiosa', 'dolorosa', 'gloriosa'].includes(section);
  const currentProgress = progress[section] || 0;
  
  // Force re-animation when section changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [section]);

  const getSectionTitle = () => {
    switch (section) {
      case 'gaudiosa': return 'Mysteria Gaudiosa';
      case 'dolorosa': return 'Mysteria Dolorosa';
      case 'gloriosa': return 'Mysteria Gloriosa';
      case 'initium': return 'Initium';
      case 'ultima': return 'Ultima Oratio';
      default: return 'Oratio';
    }
  };

  const getSectionIcon = () => {
    switch (section) {
      case 'gaudiosa': return 'fas fa-baby';
      case 'dolorosa': return 'fas fa-heart';
      case 'gloriosa': return 'fas fa-crown';
      case 'initium': return 'fas fa-cross';
      case 'ultima': return 'fas fa-dove';
      default: return 'fas fa-pray';
    }
  };

  const handleBeadClick = (index: number) => {
    if (isMysterySection) {
      onProgressUpdate(section, index);
    }
  };

  const getProgressPercentage = () => {
    if (!isMysterySection) return 0;
    return Math.round((currentProgress / 5) * 100);
  };

  if (!isMysterySection) {
    return null; // Only show for mystery sections
  }

  return (
    <div className="sacred-progress-tracker mb-8">
      {/* Main Progress Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--cathedral-shadow)]/80 to-[var(--gothic-stone)]/60 border border-[var(--ancient-gold-alpha)] backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent animate-shimmer"></div>
        </div>
        
        <div className="relative p-6">
          

          {/* Rosary Beads Progress */}
          <div className="text-center">
            <p className="text-xs text-parchment/60 font-inter mb-3 uppercase tracking-wide">
              Mistérios Completados
            </p>
            <div key={animationKey}>
              <RosaryBeads
                completed={currentProgress}
                total={5}
                size="lg"
                onBeadClick={handleBeadClick}
                animated={true}
              />
            </div>
          </div>

          {/* Current Mystery Indicator */}
          {currentProgress < 5 && (
            <div className="mt-6 pt-4 border-t border-[var(--ancient-gold-alpha)]">
              <div className="text-center">
                <p className="text-xs text-parchment/60 font-inter mb-2">
                  Mistério Atual
                </p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[var(--ancient-gold-alpha)] border border-[var(--ancient-gold)] animate-pulse-gentle">
                  <div className="w-2 h-2 rounded-full bg-[var(--ancient-gold)] animate-ping"></div>
                  <span className="text-sm font-cinzel text-ancient-gold font-medium">
                    {currentProgress + 1}º Mistério
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Completion Celebration */}
          {currentProgress >= 5 && (
            <div className="mt-6 pt-4 border-t border-[var(--ancient-gold-alpha)]">
              <div className="text-center animate-celebration">
                <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--ancient-gold)] to-[var(--byzantine-gold)] shadow-lg animate-gentle-glow">
                  <i className="fas fa-crown text-[var(--cathedral-void)] text-lg animate-bounce"></i>
                  <span className="text-base font-cinzel text-[var(--cathedral-void)] font-semibold">
                    Mistérios Completados!
                  </span>
                  <i className="fas fa-star text-[var(--cathedral-void)] text-lg animate-bounce"></i>
                </div>
                <p className="text-xs text-parchment/70 font-inter mt-2">
                  Deo Gratias ✠
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}