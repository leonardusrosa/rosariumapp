import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { VestmentColor } from "@/types/liturgy";

interface LiturgyHeaderProps {
  selectedDate: string;
  title: string;
  liturgicalClass?: string;
  vestmentColor: VestmentColor;
  colorLabel: string;
  isToday: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onDateSelect: (dateStr: string) => void;
}

const colorDots: Record<VestmentColor, string> = {
  green: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  red: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
  white: "bg-amber-100 shadow-[0_0_8px_rgba(254,243,199,0.6)]",
  violet: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]",
  black: "bg-neutral-600 shadow-[0_0_8px_rgba(115,115,115,0.6)]"
};

export default function LiturgyHeader({
  selectedDate,
  title,
  liturgicalClass,
  vestmentColor,
  colorLabel,
  isToday,
  onPreviousDay,
  onNextDay,
  onToday,
  onDateSelect
}: LiturgyHeaderProps) {
  const isMobile = useIsMobile();
  const [year, month, day] = selectedDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 mb-8">
      {/* Page Title - App Standard Format */}
      <div className={`text-center ${isMobile ? 'mb-4 pt-2' : 'mb-8 pt-4'}`}>
        <h1 className={`font-cinzel font-semibold text-parchment sacred-header-glow ${
          isMobile ? 'text-2xl' : 'text-4xl'
        }`}>
          <span className="text-ancient-gold sacred-cross-hover animate-cross-blessing">✠</span> Proprium Missae <span className="text-ancient-gold sacred-cross-hover animate-cross-blessing">✠</span>
        </h1>
      </div>

      {/* Date Switcher - App Glassmorphism Control */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="inline-flex items-center bg-cathedral-dark/40 rounded-xl p-1.5 border border-ancient-gold/25 glass-morphism">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreviousDay}
            className="text-parchment hover:text-ancient-gold hover:bg-ancient-gold/10 h-8 px-3 text-xs sm:text-sm font-cinzel"
          >
            <i className="fas fa-chevron-left mr-1.5 text-xs text-ancient-gold" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          {/* Native Date Input Picker */}
          <div className="relative px-3 py-1 border-x border-ancient-gold/20 flex items-center gap-2 cursor-pointer hover:bg-ancient-gold/10 transition-colors rounded">
            <i className="fas fa-calendar-alt text-ancient-gold text-xs" />
            <span className="font-cinzel text-xs sm:text-sm text-ancient-gold font-medium">
              {day.toString().padStart(2, '0')}/{month.toString().padStart(2, '0')}/{year}
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateSelect(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onNextDay}
            className="text-parchment hover:text-ancient-gold hover:bg-ancient-gold/10 h-8 px-3 text-xs sm:text-sm font-cinzel"
          >
            <span className="hidden sm:inline">Próximo</span>
            <i className="fas fa-chevron-right ml-1.5 text-xs text-ancient-gold" />
          </Button>
        </div>

        {!isToday && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="text-[11px] font-cinzel text-ancient-gold/80 hover:text-ancient-gold hover:bg-ancient-gold/10 h-6 px-2.5 rounded-full border border-ancient-gold/20"
          >
            Hodie (Voltar para Hoje)
          </Button>
        )}
      </div>

      {/* Sacred Header - App Standard Hero Card */}
      <div className="text-center glass-morphism p-6 sm:p-8 rounded-2xl sacred-border animate-fade-in-up">
        <p className="text-xs sm:text-sm font-inter text-parchment/60 uppercase tracking-widest capitalize mb-2">
          {formattedDate}
        </p>
        <h2 className="sacred-display text-ancient-gold mb-3 text-2xl sm:text-3xl lg:text-4xl font-cinzel font-semibold tracking-wide leading-tight">
          {title}
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto mb-4 rounded-full"></div>
        
        {liturgicalClass && (
          <p className="text-parchment font-inter text-sm sm:text-base max-w-2xl mx-auto mb-3">
            {liturgicalClass}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-inter font-medium bg-cathedral-dark/50 border border-ancient-gold/30 text-parchment">
            <span className={`w-2 h-2 rounded-full mr-2 ${colorDots[vestmentColor] || colorDots.white}`} />
            Paramento {colorLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
