import { useDailyLiturgy } from "@/hooks/useDailyLiturgy";
import LiturgyHeader from "./LiturgyHeader";
import LiturgySectionCard from "./LiturgySectionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFontSize } from "@/hooks/useFontSize";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DailyLiturgyContent() {
  const {
    selectedDate,
    setSelectedDate,
    goToNextDay,
    goToPreviousDay,
    goToToday,
    data,
    isLoading,
    isError,
    error,
    refetch,
    isToday
  } = useDailyLiturgy();

  const { getFontSizeClass, getLineHeightClass, getLetterSpacingClass } = useFontSize();
  const isMobile = useIsMobile();

  const mainContainerClass = `animate-fade-in relative px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 main-content ${
    !isMobile ? 'ml-96' : 'mobile-container pt-2'
  }`;

  if (isLoading) {
    return (
      <main className={mainContainerClass}>
        <div className="space-y-8 animate-pulse pt-8 pb-24 max-w-4xl mx-auto">
          <div className="h-12 w-64 mx-auto bg-ancient-gold/10 rounded-xl" />
          <div className="h-40 glass-morphism rounded-2xl sacred-border" />
          <div className="space-y-6">
            <div className="h-48 sacred-content-card rounded-2xl sacred-border" />
            <div className="h-48 sacred-content-card rounded-2xl sacred-border" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className={mainContainerClass}>
        <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
          <h2 className="text-2xl font-cinzel text-ancient-gold sacred-header-glow">
            ✠ Liturgia non inventa ✠
          </h2>
          <p className="text-parchment/70 font-inter text-sm">
            {error?.message || 'Não foi possível carregar os textos litúrgicos para esta data.'}
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-ancient-gold/30 text-ancient-gold hover:bg-ancient-gold/10"
            >
              <i className="fas fa-redo mr-2" /> Tentar Novamente
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="text-parchment hover:text-ancient-gold"
            >
              Hodie (Voltar para Hoje)
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={mainContainerClass}>
      <div className="max-w-4xl mx-auto space-y-8 pb-28">
        {/* App Standard Sacred Header */}
        <LiturgyHeader
          selectedDate={selectedDate}
          title={data.title}
          liturgicalClass={data.liturgicalClass}
          vestmentColor={data.vestmentColor}
          colorLabel={data.colorLabel}
          isToday={isToday}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          onToday={goToToday}
          onDateSelect={setSelectedDate}
        />

        {/* Spiritual commentary / Dom Gaspar Lefebvre */}
        {data.commentary && (
          <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up transition-all duration-700 ease-in-out">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="font-cinzel text-xl sm:text-2xl font-medium text-ancient-gold sacred-header-glow mb-2 flex items-center justify-center gap-2">
                  <span className="text-ancient-gold text-lg">✠</span>
                  <span>Meditatio Liturgica</span>
                  <span className="text-ancient-gold text-lg">✠</span>
                </h3>
                <p className="text-xs text-ancient-gold/70 font-inter">
                  Dom Gaspar Lefebvre, O.S.B. — Missal Quotidiano
                </p>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto mt-3 rounded-full"></div>
              </div>
              
              <div className={`prayer-content text-parchment font-lora italic text-justify leading-relaxed ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}>
                <p className="leading-relaxed">
                  {data.commentary}
                </p>
              </div>

              {data.missalPages && (
                <p className="text-xs text-parchment/50 font-inter mt-6 text-center pt-3 border-t border-ancient-gold/20">
                  {data.missalPages}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Liturgical Sections (Introito, Coleta, Epístola, etc.) */}
        <div className="space-y-6">
          {data.sections.map((section) => (
            <LiturgySectionCard
              key={section.id}
              item={section}
            />
          ))}
        </div>

        {/* Footer attribution */}
        {data.sourceUrl && (
          <footer className="text-center pt-8 pb-4 text-xs text-parchment/50 font-inter space-y-1.5 border-t border-ancient-gold/20">
            <p>
              Missale Romanum (1962) — Missal Quotidiano de Dom Gaspar Lefebvre (1963)
            </p>
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-ancient-gold/80 hover:text-ancient-gold underline underline-offset-4 gap-1.5 text-xs"
            >
              <span>Fonte: Irmandade Nossa Senhora do Carmo</span>
              <i className="fas fa-external-link-alt text-[10px]" />
            </a>
          </footer>
        )}
      </div>
    </main>
  );
}
