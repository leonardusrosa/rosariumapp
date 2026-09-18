import React from "react";
import { useLocation, Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NAV_SECTIONS } from "@/lib/bibliothecaData";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { NavIcon } from "./NavIcon";
import { AccountAffordance } from "./AccountAffordance";

export function LibrarySidebar() {
  const [location] = useLocation();
  const { libraryItems, readingQueue, readingRecords, wishlistItems } = useBibliotheca();

  const getSectionBadge = (id: string) => {
    switch (id) {
      case "library":
        return libraryItems.length;
      case "reading":
        return libraryItems.filter((i) => i.readingStatus === "reading").length;
      case "next":
        return readingQueue.length;
      case "read":
        return readingRecords.length;
      case "wishlist":
        return wishlistItems.length;
      default:
        return null;
    }
  };

  return (
    <aside
      aria-label="Navegação da Biblioteca"
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 lg:w-72 z-30 bg-[var(--cathedral-void)]/95 backdrop-blur-xl border-r border-[var(--ancient-gold-alpha-soft)] text-[var(--text-primary)]"
    >
      {/* Brand Header */}
      <div className="pt-8 pb-6 px-6 border-b border-[var(--ancient-gold-alpha-soft)]/60">
        <Link href="/library" className="group block focus:outline-none">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--ancient-gold-alpha)] border border-[var(--ancient-gold-warm)]/40 text-[var(--ancient-gold-bright)] group-hover:border-[var(--byzantine-gold)] transition-colors duration-300">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="M6 14h6" />
              </svg>
            </div>
            <div>
              <span className="block font-cinzel text-lg font-semibold tracking-wider text-[var(--ancient-gold-bright)] group-hover:text-[var(--byzantine-gold)] transition-colors">
                BIBLIOTHECA
              </span>
              <span className="block font-cormorant text-xs italic text-[var(--sacred-ivory)]/60 tracking-wide">
                Bibliotheca Mea
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1 py-4 px-3">
        <nav className="space-y-1.5" aria-label="Seções">
          {NAV_SECTIONS.map((section) => {
            const isActive =
              location === section.href ||
              (section.href === "/library" && (location === "/" || location === ""));

            const badge = getSectionBadge(section.id);

            return (
              <Link
                key={section.id}
                href={section.href}
                className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-lg transition-all duration-300 relative text-left ${
                  isActive
                    ? "bg-[var(--byzantine-gold-alpha)] text-[var(--byzantine-gold)] border border-[var(--byzantine-gold)]/40 shadow-[0_0_15px_rgba(205,154,43,0.12)] font-medium"
                    : "text-[var(--sacred-ivory)]/70 hover:text-[var(--parchment)] hover:bg-[var(--ancient-gold-alpha-soft)] border border-transparent"
                }`}
              >
                {/* Active left indicator pill */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--ancient-gold-bright)]"
                  />
                )}

                <NavIcon
                  name={section.iconName}
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    isActive
                      ? "text-[var(--ancient-gold-bright)]"
                      : "text-[var(--sacred-ivory)]/60 group-hover:text-[var(--ancient-gold)]"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-sm leading-tight tracking-wide truncate">
                      {section.latinTitle}
                    </span>
                    {badge !== null && badge > 0 && (
                      <span className="text-[10px] font-inter px-1.5 py-0.5 rounded-full bg-[var(--stone-gray-alpha)] text-[var(--ancient-gold)] border border-[var(--ancient-gold-alpha-soft)]">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="block font-cormorant text-xs italic text-[var(--sacred-ivory)]/50 leading-tight truncate">
                    {section.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Account / Cloud Affordance & Study Footer */}
      <div className="p-3 mx-3 mb-4 rounded-xl bg-[var(--stone-gray-alpha)]/30 border border-[var(--ancient-gold-alpha-soft)]/40 space-y-3">
        <AccountAffordance />
        <div className="flex items-center justify-between text-xs text-[var(--sacred-ivory)]/50 font-cormorant italic pt-2 border-t border-white/5">
          <span>Estúdio Privado</span>
          <span className="text-[10px] font-inter text-[var(--ancient-gold)]/70">v0.5</span>
        </div>
      </div>
    </aside>
  );
}

export default LibrarySidebar;
