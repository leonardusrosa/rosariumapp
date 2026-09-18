import React from "react";
import { GeneratedCoverDef, CoverDefinition } from "@/types/bibliotheca";

interface GeneratedCoverProps {
  title: string;
  author: string;
  cover: GeneratedCoverDef | CoverDefinition;
  className?: string;
  isLarge?: boolean;
}

export function GeneratedCover({
  title,
  author,
  cover,
  className = "",
  isLarge = false,
}: GeneratedCoverProps) {
  const { style, primaryColor, accentColor, textColor, geometryShape, subtitle } = cover;

  return (
    <div
      className={`w-full h-full relative p-3.5 flex flex-col justify-between overflow-hidden select-none ${className}`}
      style={{ backgroundColor: primaryColor, color: textColor }}
    >
      {/* Subtle paper / cloth surface texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%), linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%)",
          backgroundSize: "6px 6px",
          backgroundPosition: "0 0, 3px 3px",
        }}
      />

      {/* Book spine lighting simulation on left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none opacity-40 z-20"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.15) 35%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Banded style */}
      {style === "banded" && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/4 h-24 pointer-events-none opacity-20"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Geometric shapes */}
      {geometryShape === "circle" && (
        <div
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
            isLarge ? "w-32 h-32" : "w-20 h-20"
          } rounded-full border pointer-events-none opacity-30`}
          style={{ borderColor: accentColor }}
        />
      )}
      {geometryShape === "arch" && (
        <div
          aria-hidden="true"
          className="absolute inset-x-5 top-5 bottom-12 rounded-t-full border pointer-events-none opacity-30"
          style={{ borderColor: accentColor }}
        />
      )}
      {geometryShape === "rule-lines" && (
        <div
          aria-hidden="true"
          className="absolute inset-x-4 top-3 bottom-3 border-y pointer-events-none opacity-35"
          style={{ borderColor: accentColor }}
        />
      )}
      {geometryShape === "cross-hatch" && (
        <div
          aria-hidden="true"
          className="absolute right-3 top-3 w-12 h-12 border-t border-r pointer-events-none opacity-40"
          style={{ borderColor: accentColor }}
        />
      )}

      {/* Top author label */}
      <div className="relative z-10">
        <p
          className={`font-inter ${
            isLarge ? "text-xs" : "text-[10px]"
          } tracking-widest uppercase truncate opacity-80`}
          style={{ color: accentColor }}
        >
          {author}
        </p>
      </div>

      {/* Center title */}
      <div className="relative z-10 my-auto py-2">
        <h3
          className={`font-cinzel ${
            isLarge ? "text-lg sm:text-xl md:text-2xl font-bold" : "text-sm sm:text-base font-bold"
          } leading-snug line-clamp-4 tracking-wide`}
          style={{ color: textColor }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={`font-cormorant ${
              isLarge ? "text-sm" : "text-[11px]"
            } italic mt-1 line-clamp-2 opacity-70`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom edition badge */}
      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10">
        <span
          className={`font-inter ${
            isLarge ? "text-[11px]" : "text-[9px]"
          } uppercase tracking-wider opacity-60`}
          style={{ color: accentColor }}
        >
          Ed. Bibliotheca
        </span>
        <div
          className={isLarge ? "w-2 h-2 rounded-full" : "w-1.5 h-1.5 rounded-full"}
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}
