import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Volume2 } from "lucide-react";
import type { LiturgyItem } from "@/types/liturgy";
import type { LanguageMode } from "@/hooks/useDailyLiturgy";
import { useFontSize } from "@/hooks/useFontSize";
import { useIsMobile } from "@/hooks/use-mobile";

interface LiturgySectionCardProps {
  item: LiturgyItem;
  languageMode: LanguageMode;
}

export default function LiturgySectionCard({ item, languageMode }: LiturgySectionCardProps) {
  const { getFontSizeClass, getLineHeightClass, getLetterSpacingClass } = useFontSize();
  const isMobile = useIsMobile();

  const formatText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => (
      <p key={idx} className="mb-3 last:mb-0 leading-relaxed text-justify">
        {line}
      </p>
    ));
  };

  const showLatin = !isMobile || languageMode === 'latin' || languageMode === 'bilingual';
  const showPortuguese = !isMobile || languageMode === 'portuguese' || languageMode === 'bilingual';

  return (
    <Collapsible defaultOpen={true}>
      <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up transition-all duration-700 ease-in-out">
        <CardContent className="p-6 sm:p-8">
          <CollapsibleTrigger asChild>
            <div className="text-center mb-6 cursor-pointer group">
              <h2 className="font-cinzel text-xl sm:text-2xl font-medium text-ancient-gold sacred-header-glow mb-2 flex items-center justify-center">
                <span className="text-ancient-gold mr-2.5 text-lg sacred-icon-hover">✠</span>
                <span>{item.title}</span>
                {item.reference && (
                  <span className="text-xs font-inter text-parchment/60 font-normal ml-2">
                    ({item.reference})
                  </span>
                )}
                <ChevronDown className="w-4 h-4 ml-2.5 text-ancient-gold transition-transform duration-200 group-data-[state=closed]:rotate-180" />
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full"></div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            {item.audioUrl && (
              <div className="flex justify-center mb-4">
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="h-7 px-3 text-xs text-ancient-gold hover:bg-ancient-gold/10 border border-ancient-gold/20 rounded-full"
                >
                  <a href={item.audioUrl} target="_blank" rel="noopener noreferrer" title="Canto Gregoriano">
                    <Volume2 className="w-3.5 h-3.5 mr-1.5 text-ancient-gold" />
                    <span>Canto Gregoriano</span>
                  </a>
                </Button>
              </div>
            )}

            {/* Prayer columns matching app layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {showLatin && (
                <div className={`prayer-column ${!showPortuguese ? 'md:col-span-2' : ''}`}>
                  <div className="text-center pb-2 mb-3 border-b border-ancient-gold/20">
                    <span className="text-xs font-cinzel text-ancient-gold uppercase tracking-widest font-semibold">
                      Latina
                    </span>
                  </div>
                  <div className={`prayer-latin text-parchment font-lora ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}>
                    {item.latin ? formatText(item.latin) : <p className="italic text-parchment/40">Textus latinus non suppetit.</p>}
                  </div>
                </div>
              )}

              {showPortuguese && (
                <div className={`prayer-column ${!showLatin ? 'md:col-span-2' : ''}`}>
                  <div className="text-center pb-2 mb-3 border-b border-ancient-gold/20">
                    <span className="text-xs font-cinzel text-ancient-gold uppercase tracking-widest font-semibold">
                      Português
                    </span>
                  </div>
                  <div className={`prayer-portuguese text-parchment font-lora ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}>
                    {item.portuguese ? formatText(item.portuguese) : <p className="italic text-parchment/40">Tradução não disponível.</p>}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
