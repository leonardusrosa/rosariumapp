import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { MoreHorizontal, X } from "lucide-react";
import { NavIcon } from "./NavIcon";
import { AccountAffordance } from "./AccountAffordance";

const PERMANENT_ITEMS = [
  { id: "library", title: "Bibliotheca", href: "/library", iconName: "BookCopy" },
  { id: "reading", title: "Lectio", href: "/reading", iconName: "BookOpen" },
  { id: "next", title: "Proxima", href: "/next", iconName: "Bookmark" },
  { id: "ai", title: "Sapientia", href: "/ai", iconName: "Sparkles" }
];

const MORE_ITEMS = [
  { id: "read", title: "Lecta", subtitle: "Já lidos", href: "/read", iconName: "BookCheck" },
  { id: "wishlist", title: "Desiderata", subtitle: "Lista de desejos", href: "/wishlist", iconName: "Heart" },
  { id: "collections", title: "Collectiones", subtitle: "Coleções", href: "/collections", iconName: "Layers" },
  { id: "notes", title: "Notae", subtitle: "Notas", href: "/notes", iconName: "NotebookPen" }
];

export function MobileNavigation() {
  const [location] = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isMoreActive = MORE_ITEMS.some((item) => location === item.href);

  return (
    <>
      {/* Expanded 'Mais' Drawer / Sheet */}
      {isMoreOpen && (
        <div
          role="dialog"
          aria-label="Mais seções da biblioteca"
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="w-full bg-[var(--cathedral-void)]/98 border-t border-[var(--ancient-gold-warm)]/40 rounded-t-2xl p-5 shadow-2xl pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--ancient-gold-alpha-soft)]">
              <span className="font-cinzel text-sm font-semibold text-[var(--ancient-gold-bright)] tracking-wider">
                Outras Seções
              </span>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full text-[var(--sacred-ivory)]/70 hover:text-[var(--parchment)] hover:bg-[var(--stone-gray-alpha)]"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {MORE_ITEMS.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isActive
                        ? "bg-[var(--byzantine-gold-alpha)] border-[var(--byzantine-gold)]/50 text-[var(--byzantine-gold)]"
                        : "bg-[var(--stone-gray-alpha)]/40 border-[var(--ancient-gold-alpha-soft)] text-[var(--parchment)] hover:border-[var(--ancient-gold-warm)]/50"
                    }`}
                  >
                    <NavIcon
                      name={item.iconName}
                      className={`w-5 h-5 ${isActive ? "text-[var(--byzantine-gold)]" : "text-[var(--ancient-gold)]"}`}
                    />
                    <div className="min-w-0">
                      <span className="block font-cinzel text-xs font-semibold leading-tight truncate">
                        {item.title}
                      </span>
                      <span className="block font-cormorant text-[11px] italic text-[var(--sacred-ivory)]/60 leading-tight truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <AccountAffordance compact />
            </div>
          </div>
        </div>
      )}

      {/* Permanent Bottom Nav Bar */}
      <nav
        aria-label="Navegação móvel"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--cathedral-void)]/95 backdrop-blur-lg border-t border-[var(--ancient-gold-alpha-soft)] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-8px_24px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-around">
          {PERMANENT_ITEMS.map((item) => {
            const isActive =
              location === item.href ||
              (item.href === "/library" && (location === "/" || location === ""));

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[50px] rounded-lg transition-all ${
                  isActive
                    ? "text-[var(--byzantine-gold)] font-medium"
                    : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
                }`}
              >
                <div className="relative">
                  <NavIcon
                    name={item.iconName}
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? "scale-110 text-[var(--byzantine-gold)]" : ""
                    }`}
                  />
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--ancient-gold-bright)]"
                    />
                  )}
                </div>
                <span className="text-[10px] font-cinzel tracking-wider mt-1 leading-none truncate max-w-[64px]">
                  {item.title}
                </span>
              </Link>
            );
          })}

          {/* 'Mais' Button */}
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[50px] rounded-lg transition-all ${
              isMoreActive || isMoreOpen
                ? "text-[var(--byzantine-gold)] font-medium"
                : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
            }`}
          >
            <div className="relative">
              <MoreHorizontal
                className={`w-5 h-5 transition-transform duration-200 ${
                  isMoreActive || isMoreOpen ? "scale-110 text-[var(--byzantine-gold)]" : ""
                }`}
              />
              {isMoreActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--ancient-gold-bright)]"
                />
              )}
            </div>
            <span className="text-[10px] font-cinzel tracking-wider mt-1 leading-none">
              Mais
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileNavigation;
