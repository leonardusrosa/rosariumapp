import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Layers } from "lucide-react";
import type { NovenaViewMode } from "@/hooks/useNovenaDay";

interface NovenaDaySelectorProps {
  totalDays: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
  isFirstDay: boolean;
  isLastDay: boolean;
  viewMode: NovenaViewMode;
  onToggleViewMode: (mode: NovenaViewMode) => void;
}

export function NovenaDaySelector({
  totalDays,
  selectedDay,
  onSelectDay,
  onNextDay,
  onPrevDay,
  isFirstDay,
  isLastDay,
  viewMode,
  onToggleViewMode,
}: NovenaDaySelectorProps) {
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="mb-6 space-y-3 pt-2">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ancient-gold/20 pb-3">
        {/* Day Stepper */}
        {viewMode === "novena" ? (
          <div className="inline-flex items-center bg-cathedral-dark/60 rounded-xl p-1 border border-ancient-gold/30">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onPrevDay}
              disabled={isFirstDay}
              className="h-7 px-2.5 text-xs font-cinzel text-parchment hover:text-ancient-gold hover:bg-ancient-gold/10 disabled:opacity-30"
              title="Dia anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1 text-ancient-gold" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <span className="px-3 text-xs sm:text-sm font-cinzel font-semibold text-ancient-gold tracking-wide">
              Dia {selectedDay} de {totalDays}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onNextDay}
              disabled={isLastDay}
              className="h-7 px-2.5 text-xs font-cinzel text-parchment hover:text-ancient-gold hover:bg-ancient-gold/10 disabled:opacity-30"
              title="Próximo dia"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 text-ancient-gold" />
            </Button>
          </div>
        ) : (
          <span className="text-xs font-cinzel text-ancient-gold/80 uppercase tracking-wider">
            Exibição: Texto Completo
          </span>
        )}

        {/* View Mode Toggle Button */}
        <div className="inline-flex items-center bg-cathedral-dark/40 rounded-lg p-0.5 border border-ancient-gold/20">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleViewMode("novena")}
            className={`h-7 px-2.5 text-[11px] font-cinzel transition-all ${
              viewMode === "novena"
                ? "bg-ancient-gold/20 text-ancient-gold font-medium border border-ancient-gold/40"
                : "text-parchment/60 hover:text-parchment"
            }`}
          >
            <Layers className="w-3 h-3 mr-1.5" />
            Dia a Dia
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleViewMode("full")}
            className={`h-7 px-2.5 text-[11px] font-cinzel transition-all ${
              viewMode === "full"
                ? "bg-ancient-gold/20 text-ancient-gold font-medium border border-ancient-gold/40"
                : "text-parchment/60 hover:text-parchment"
            }`}
          >
            <BookOpen className="w-3 h-3 mr-1.5" />
            Completo
          </Button>
        </div>
      </div>

      {/* Progress Bar in Novena Mode */}
      {viewMode === "novena" && (
        <div className="space-y-1 px-1">
          <div className="flex justify-between items-center text-[10px] font-cinzel text-ancient-gold/70">
            <span>Progresso da Novena</span>
            <span>{Math.round((selectedDay / totalDays) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-cathedral-dark/60 rounded-full overflow-hidden border border-ancient-gold/20">
            <div
              className="h-full bg-gradient-to-r from-ancient-gold/60 to-ancient-gold transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(201,163,94,0.6)]"
              style={{ width: `${(selectedDay / totalDays) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Numbered Day Pills (Visible in Novena mode) */}
      {viewMode === "novena" && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {daysArray.map((day) => {
            const isActive = day === selectedDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay(day)}
                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-cinzel font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-ancient-gold text-cathedral-dark shadow-[0_0_10px_rgba(201,163,94,0.5)] scale-105"
                    : "bg-cathedral-dark/40 text-parchment/80 border border-ancient-gold/25 hover:bg-ancient-gold/15 hover:text-ancient-gold hover:border-ancient-gold/40"
                }`}
                title={`Ir para o ${day}º Dia`}
              >
                {day}º
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
