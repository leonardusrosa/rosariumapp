import React, { useState } from "react";
import { Cloud, CloudOff, LogIn, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBibliotheca } from "@/contexts/BibliothecaContext";
import { BibliothecaAuthDialog } from "./BibliothecaAuthDialog";

interface AccountAffordanceProps {
  compact?: boolean;
}

export function AccountAffordance({ compact = false }: AccountAffordanceProps) {
  const { user, logout } = useAuth();
  const { isCloudLoading } = useBibliotheca();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (compact) {
    if (user) {
      return (
        <>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-black/30 border border-white/5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[var(--ancient-gold-alpha-soft)] border border-[var(--ancient-gold-alpha-medium)] flex items-center justify-center text-[var(--ancient-gold)] shrink-0">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-[var(--parchment)] truncate">
                {user.username || user.email.split("@")[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Sair da conta"
              className="p-1 text-[var(--sacred-ivory)]/50 hover:text-red-400 transition-colors"
            >
              {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            </button>
          </div>
          <BibliothecaAuthDialog
            open={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode={authMode}
          />
        </>
      );
    }

    return (
      <>
        <button
          onClick={() => openAuth("login")}
          className="w-full py-2 px-3 rounded-lg bg-[var(--stone-gray-alpha)]/40 hover:bg-[var(--stone-gray-alpha)] border border-[var(--ancient-gold-alpha-soft)] text-xs text-[var(--ancient-gold)] flex items-center justify-center gap-1.5 transition-all"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Entrar / Nuvem</span>
        </button>
        <BibliothecaAuthDialog
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  // Full sidebar layout
  return (
    <>
      <div className="pt-3 border-t border-white/5">
        {user ? (
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[var(--ancient-gold-alpha-soft)] border border-[var(--ancient-gold-alpha-medium)] flex items-center justify-center text-[var(--ancient-gold)] shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[var(--parchment)] truncate">
                    {user.username || user.email.split("@")[0]}
                  </div>
                  <div className="text-[10px] text-[var(--sacred-ivory)]/50 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[var(--ancient-gold)]">
                {isCloudLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--ancient-gold)]" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-emerald-400/80" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
              <span className="text-emerald-400/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Acervo sincronizado
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-[var(--sacred-ivory)]/50 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                {isLoggingOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
                <span>Sair</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[var(--sacred-ivory)]/60">
              <span className="flex items-center gap-1.5">
                <CloudOff className="w-3.5 h-3.5 text-[var(--ancient-gold)]/60" />
                Modo local (dispositivo)
              </span>
            </div>
            <p className="text-[10px] text-[var(--sacred-ivory)]/40 leading-tight">
              Sincronize sua biblioteca em nuvem e acesse em qualquer aparelho.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => openAuth("login")}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[var(--ancient-gold)] hover:bg-[var(--gold-leaf)] text-black text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                <span>Entrar</span>
              </button>
              <button
                onClick={() => openAuth("register")}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[var(--parchment)] transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </div>
        )}
      </div>

      <BibliothecaAuthDialog
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
}

export default AccountAffordance;
