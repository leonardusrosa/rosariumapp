import React from "react";

interface PageHeaderProps {
  latinTitle: string;
  subtitle: string;
  countLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  latinTitle,
  subtitle,
  countLabel,
  actions
}: PageHeaderProps) {
  return (
    <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--ancient-gold-alpha-soft)] pb-4 md:pb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-[var(--parchment)] sacred-header-glow">
            {latinTitle}
          </h1>
          {countLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium bg-[var(--ancient-gold-alpha-soft)] text-[var(--ancient-gold-bright)] border border-[var(--ancient-gold-warm)]/30">
              {countLabel}
            </span>
          )}
        </div>
        <p className="font-cormorant text-base sm:text-lg italic text-[var(--sacred-ivory)]/70 mt-1">
          {subtitle}
        </p>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export default PageHeader;
