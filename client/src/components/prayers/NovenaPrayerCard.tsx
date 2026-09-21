import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles, ChevronRight, Check } from "lucide-react";
import { useFontSize } from "@/hooks/useFontSize";
import { useNovenaDay } from "@/hooks/useNovenaDay";
import { NovenaDaySelector } from "./NovenaDaySelector";
import type { NovenaData } from "@/lib/novenaParser";

interface NovenaPrayerCardProps {
  prayer: {
    id: number;
    title: string;
    content: string;
    section: string;
  };
  novenaData: NovenaData;
}

export function NovenaPrayerCard({ prayer, novenaData }: NovenaPrayerCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isInitialPrayersOpen, setIsInitialPrayersOpen] = useState(true);
  const { getFontSizeClass, getLineHeightClass, getLetterSpacingClass } = useFontSize();

  const {
    selectedDay,
    setSelectedDay,
    nextDay,
    prevDay,
    viewMode,
    setViewMode,
    isFirstDay,
    isLastDay,
  } = useNovenaDay(prayer.id, novenaData.totalDays);

  const currentDay =
    novenaData.days.find((d) => d.dayNumber === selectedDay) ||
    novenaData.days[0];

  const typographyClasses = `${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up transition-all duration-700 ease-in-out">
        <CardContent className="p-6 sm:p-8">
          <CollapsibleTrigger asChild>
            <div className="text-center mb-6 cursor-pointer group">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-cinzel font-medium bg-ancient-gold/15 border border-ancient-gold/30 text-ancient-gold mb-2.5">
                <Sparkles className="w-3 h-3 text-ancient-gold" />
                <span>Modo Novena • {novenaData.totalDays} Dias</span>
              </div>

              <h2 className="font-cinzel text-xl sm:text-2xl font-medium text-ancient-gold sacred-header-glow mb-2 flex items-center justify-center">
                <span>{prayer.title}</span>
                <ChevronDown
                  className={`w-5 h-5 ml-3 text-ancient-gold transition-transform duration-200 ${
                    isOpen ? "rotate-0" : "rotate-180"
                  }`}
                />
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full"></div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            {/* View Mode: Raw full text */}
            {viewMode === "full" ? (
              <div className="space-y-4">
                {/* Selector placed at top in full mode for quick toggle back */}
                <NovenaDaySelector
                  totalDays={novenaData.totalDays}
                  selectedDay={selectedDay}
                  onSelectDay={setSelectedDay}
                  onNextDay={nextDay}
                  onPrevDay={prevDay}
                  isFirstDay={isFirstDay}
                  isLastDay={isLastDay}
                  viewMode={viewMode}
                  onToggleViewMode={setViewMode}
                />
                <div className="prayer-grid">
                  <div className="prayer-column col-span-2">
                    <div className="prayer-content">
                      <div
                        className={`prayer-portuguese ${typographyClasses}`}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {prayer.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode: Day-by-Day */
              <div className="space-y-6">
                {/* 1. Preparatory / Initial Prayers (Fixed at top with collapsible toggle) */}
                {novenaData.initialPrayers && (
                  <div className="bg-cathedral-dark/30 rounded-xl p-4 sm:p-5 border border-ancient-gold/20 transition-all">
                    <button
                      type="button"
                      onClick={() => setIsInitialPrayersOpen(!isInitialPrayersOpen)}
                      className="w-full flex items-center justify-between pb-2 border-b border-ancient-gold/15 cursor-pointer group text-left"
                    >
                      <h3 className="font-cinzel text-xs sm:text-sm font-semibold text-ancient-gold tracking-wide group-hover:text-ancient-gold/80 transition-colors">
                        ✠ Orações Iniciais para Todos os Dias
                      </h3>
                      <span className="text-[11px] font-cinzel text-ancient-gold/70 flex items-center gap-1 group-hover:text-ancient-gold transition-colors">
                        <span>{isInitialPrayersOpen ? "Recolher" : "Expandir"}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isInitialPrayersOpen ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      </span>
                    </button>
                    {isInitialPrayersOpen && (
                      <div
                        className={`prayer-portuguese text-parchment/90 pt-3 ${typographyClasses}`}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {novenaData.initialPrayers}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Day Selector: DIRECTLY ABOVE DAILY PRAYER */}
                <div id={`novena-day-anchor-${prayer.id}`}>
                  <NovenaDaySelector
                    totalDays={novenaData.totalDays}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                    onNextDay={nextDay}
                    onPrevDay={prevDay}
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                    viewMode={viewMode}
                    onToggleViewMode={setViewMode}
                  />
                </div>

                {/* 3. Active Day Meditation */}
                {currentDay && (
                  <div className="bg-cathedral-dark/50 rounded-xl p-5 sm:p-7 border border-ancient-gold/35 shadow-[0_0_15px_rgba(201,163,94,0.08)]">
                    <div className="text-center mb-5 pb-3 border-b border-ancient-gold/25">
                      <p className="text-[11px] font-cinzel text-ancient-gold/70 uppercase tracking-widest mb-1">
                        Dia {currentDay.dayNumber} de {novenaData.totalDays}
                      </p>
                      <h3 className="font-cinzel text-lg sm:text-xl font-medium text-ancient-gold sacred-header-glow">
                        ✠ {currentDay.title} ✠
                      </h3>
                    </div>

                    <div
                      className={`prayer-portuguese font-lora italic text-parchment leading-relaxed ${typographyClasses}`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {currentDay.content}
                    </div>

                    {/* Completion / Advance Action Button */}
                    <div className="text-center pt-5 mt-6 border-t border-ancient-gold/20">
                      {!isLastDay ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            nextDay();
                            const anchor = document.getElementById(`novena-day-anchor-${prayer.id}`);
                            if (anchor) {
                              anchor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                          className="text-xs font-cinzel text-ancient-gold hover:bg-ancient-gold/15 border border-ancient-gold/35 rounded-xl px-4 py-2 h-auto transition-all shadow-[0_0_8px_rgba(201,163,94,0.15)] hover:shadow-[0_0_12px_rgba(201,163,94,0.3)]"
                        >
                          <Check className="w-3.5 h-3.5 mr-1.5 text-ancient-gold" />
                          <span>Concluir {currentDay.dayNumber}º Dia e ir para o {currentDay.dayNumber + 1}º Dia</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1 text-ancient-gold" />
                        </Button>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ancient-gold/15 border border-ancient-gold/40 text-ancient-gold text-xs font-cinzel">
                          <Check className="w-4 h-4 text-ancient-gold" />
                          <span>✠ 9º Dia Concluído • Novena Finalizada com Devoção! ✠</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Closing Prayers */}
                {novenaData.closingPrayers && (
                  <div className="bg-cathedral-dark/30 rounded-xl p-5 sm:p-6 border border-ancient-gold/20">
                    <div className="text-center mb-4 pb-2 border-b border-ancient-gold/15">
                      <h3 className="font-cinzel text-sm sm:text-base font-semibold text-ancient-gold tracking-wide">
                        ✠ Orações Finais ✠
                      </h3>
                    </div>
                    <div
                      className={`prayer-portuguese text-parchment/90 ${typographyClasses}`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {novenaData.closingPrayers}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
