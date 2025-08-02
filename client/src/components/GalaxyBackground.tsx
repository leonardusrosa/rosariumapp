import Galaxy from './Galaxy';

interface GalaxyBackgroundProps {
  className?: string;
}

export default function GalaxyBackground({ className = "" }: GalaxyBackgroundProps) {
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
        twinkleIntensity={0.3}
        rotationSpeed={0.05}
      />
    </div>
  );
}
