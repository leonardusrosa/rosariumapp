import React, { useState, useEffect } from "react";
import { X, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BibliothecaAuthDialogProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function BibliothecaAuthDialog({
  open,
  onClose,
  initialMode = "login",
}: BibliothecaAuthDialogProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setPassword("");
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, username.trim() || undefined);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg = err?.message || "Ocorreu um erro ao processar sua solicitação.";
      if (msg.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos.");
      } else if (msg.includes("User already registered")) {
        setError("Este e-mail já está cadastrado. Tente entrar.");
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-md sm:mx-4 bg-[var(--cathedral-void)] border border-[var(--ancient-gold-alpha-soft)] sm:rounded-2xl rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(201,163,94,0.08)] overflow-hidden flex flex-col p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--sacred-ivory)]/50 hover:text-[var(--parchment)] hover:bg-[var(--stone-gray-alpha)]/50 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[var(--ancient-gold-alpha-soft)] bg-[var(--stone-gray-alpha)]/30 flex items-center justify-center mb-3 text-[var(--ancient-gold)] shadow-[0_0_15px_rgba(201,163,94,0.15)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[var(--parchment)]">
            {mode === "login" ? "Acessar Acervo" : "Criar Conta na Bibliotheca"}
          </h2>
          <p className="text-xs text-[var(--sacred-ivory)]/60 mt-1 max-w-xs">
            {mode === "login"
              ? "Sincronize sua biblioteca pessoal, fila e notas em todos os seus dispositivos."
              : "Seus livros, histórico de leitura e anotações salvos de forma segura e durável."}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-black/40 p-1 border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === "login"
                ? "bg-[var(--stone-gray-alpha)] text-[var(--parchment)] shadow-sm border border-white/10"
                : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === "register"
                ? "bg-[var(--stone-gray-alpha)] text-[var(--parchment)] shadow-sm border border-white/10"
                : "text-[var(--sacred-ivory)]/60 hover:text-[var(--parchment)]"
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-medium text-[var(--sacred-ivory)]/70 mb-1">
                Nome de Leitor (opcional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Como prefere ser chamado"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm text-[var(--parchment)] placeholder:text-white/20 focus:outline-none focus:border-[var(--ancient-gold)] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--sacred-ivory)]/70 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm text-[var(--parchment)] placeholder:text-white/20 focus:outline-none focus:border-[var(--ancient-gold)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--sacred-ivory)]/70 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm text-[var(--parchment)] placeholder:text-white/20 focus:outline-none focus:border-[var(--ancient-gold)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[var(--ancient-gold)] hover:bg-[var(--gold-leaf)] text-black font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(201,163,94,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : mode === "login" ? (
              "Entrar no Acervo"
            ) : (
              "Criar Minha Conta"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--sacred-ivory)]/40">
          Uso local e offline continua sempre preservado.
        </div>
      </div>
    </div>
  );
}
