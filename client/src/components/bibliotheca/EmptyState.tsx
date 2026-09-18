import React from "react";
import { Link } from "wouter";
import { NavIcon } from "./NavIcon";

interface EmptyStateProps {
  iconName: string;
  latinTitle: string;
  subtitle: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  iconName,
  latinTitle,
  subtitle,
  description,
  actionText = "Explorar minha biblioteca",
  actionHref = "/library"
}: EmptyStateProps) {
  return (
    <div className="py-20 px-6 max-w-lg mx-auto text-center flex flex-col items-center justify-center animate-fade-in">
      {/* Decorative Icon Well */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--stone-gray-alpha)]/50 border border-[var(--ancient-gold-alpha-soft)] text-[var(--ancient-gold-bright)] mb-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <NavIcon name={iconName} className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h2 className="font-cinzel text-xl sm:text-2xl font-semibold tracking-wider text-[var(--parchment)] sacred-header-glow">
        {latinTitle}
      </h2>
      <p className="font-cormorant text-base italic text-[var(--sacred-ivory)]/70 mt-1 mb-3">
        {subtitle}
      </p>

      <p className="font-inter text-sm text-[var(--sacred-ivory)]/60 max-w-sm leading-relaxed mb-8">
        {description}
      </p>

      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--ancient-gold-warm)]/40 hover:border-[var(--byzantine-gold)] bg-[var(--stone-gray-alpha)]/30 hover:bg-[var(--byzantine-gold-alpha)] text-[var(--parchment)] hover:text-[var(--byzantine-gold)] font-cinzel text-xs tracking-wider uppercase transition-all duration-300"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
