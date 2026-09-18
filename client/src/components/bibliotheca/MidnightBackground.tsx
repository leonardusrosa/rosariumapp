import React, { memo } from "react";

interface MidnightBackgroundProps {
  className?: string;
}

function MidnightBackgroundComponent({ className = "" }: MidnightBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden ${className}`}
      style={{
        backgroundColor: "var(--cathedral-void, #030304)"
      }}
    >
      {/* Top subtle golden atmospheric ambient glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(ellipse at center, var(--ancient-gold-warm, #c89f55) 0%, transparent 70%)"
        }}
      />

      {/* Subtle midnight stone radial depth */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, transparent 0%, rgba(3, 5, 8, 0.6) 60%, rgba(1, 2, 3, 0.95) 100%)"
        }}
      />

      {/* Very faint fine dust / starry texture */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, rgba(230, 215, 180, 0.4), transparent),
                            radial-gradient(1px 1px at 90px 140px, rgba(200, 160, 90, 0.3), transparent),
                            radial-gradient(1px 1px at 250px 220px, rgba(230, 215, 180, 0.35), transparent),
                            radial-gradient(1.5px 1.5px at 400px 380px, rgba(210, 175, 100, 0.25), transparent)`,
          backgroundSize: "550px 550px"
        }}
      />

      {/* Vignette edge mask */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 120px rgba(0, 0, 0, 0.9)"
        }}
      />
    </div>
  );
}

export const MidnightBackground = memo(MidnightBackgroundComponent);
export default MidnightBackground;
