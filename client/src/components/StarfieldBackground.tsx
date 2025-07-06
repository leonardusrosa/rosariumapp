import { useEffect, useRef } from "react";

interface StarfieldBackgroundProps {
  className?: string;
}

export default function StarfieldBackground({ className = "" }: StarfieldBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create additional twinkling stars
    const createTwinklingStars = () => {
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'absolute rounded-full animate-twinkle';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.backgroundColor = Math.random() > 0.7 ? 'rgba(212, 175, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        star.style.pointerEvents = 'none';
        container.appendChild(star);
      }
    };

    createTwinklingStars();

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 starfield-bg -z-10 ${className}`}
    />
  );
}
