import { useIsMobile } from "@/hooks/use-mobile";
import Galaxy from './Galaxy';

interface GalaxyBackgroundProps {
  className?: string;
}

export default function GalaxyBackground({ className = "" }: GalaxyBackgroundProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div 
        className={`fixed inset-0 -z-10 bg-[var(--cathedral-void)] ${className}`}
        style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 25%, hsla(220, 25%, 12%, 0.95) 0%, hsla(220, 20%, 5%, 0.98) 65%, hsl(0, 0%, 1%) 100%)',
          willChange: 'transform',
        }}
      />
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Galaxy 
        mouseRepulsion={true}
        mouseInteraction={true}
        density={1}
        glowIntensity={0.2}
        saturation={0.2}
        hueShift={120}
        transparent={false}
        speed={0.5}
        twinkleIntensity={0.6}
        rotationSpeed={0.05}
      />
    </div>
  );
}