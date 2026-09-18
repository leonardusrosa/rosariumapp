import React, { useState, useEffect } from "react";
import { BookCoverDef, CoverDefinition, GeneratedCoverDef } from "@/types/bibliotheca";
import { GeneratedCover } from "./GeneratedCover";

interface BookCoverProps {
  title: string;
  author: string;
  cover: BookCoverDef | CoverDefinition;
  className?: string;
  isLarge?: boolean;
}

const DEFAULT_FALLBACK: GeneratedCoverDef = {
  type: "generated",
  style: "minimal",
  primaryColor: "#1a1d20",
  accentColor: "#c89f55",
  textColor: "#ede8dd",
};

export function BookCover({
  title,
  author,
  cover,
  className = "",
  isLarge = false,
}: BookCoverProps) {
  const isRemote = "type" in cover && cover.type === "remote";
  const remoteUrl = isRemote ? cover.url : undefined;
  const [hasError, setHasError] = useState(false);

  // Reset error state when remote URL changes
  useEffect(() => {
    setHasError(false);
  }, [remoteUrl]);

  if (isRemote && remoteUrl && !hasError) {
    return (
      <div
        className={`w-full h-full relative overflow-hidden bg-[#111315] flex items-center justify-center select-none ${className}`}
      >
        <img
          src={remoteUrl}
          alt={title}
          className={`w-full h-full ${isLarge ? "object-contain" : "object-cover"}`}
          onError={() => setHasError(true)}
          loading="lazy"
        />

        {/* Subtle spine lighting simulation on left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none opacity-40 z-20"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.15) 35%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      </div>
    );
  }

  const generatedCover =
    isRemote ? cover.fallback || DEFAULT_FALLBACK : (cover as GeneratedCoverDef | CoverDefinition);

  return (
    <GeneratedCover
      title={title}
      author={author}
      cover={generatedCover}
      className={className}
      isLarge={isLarge}
    />
  );
}

export default BookCover;
