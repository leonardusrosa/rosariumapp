import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  InitiumIcon,
  GaudiosaIcon,
  DolorosaIcon,
  GloriosaIcon,
  UltimaIcon,
  IntentionsIcon,
  PropriumIcon
} from "./icons/RosaryIcons";

interface MobileBottomNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onOpenIntentions: () => void;
  progress: Record<string, number>;
}

const topSections = [
  { id: 'initium', title: 'Prima', icon: 'initium' },
  { id: 'gaudiosa', title: 'Gaudiosa', icon: 'gaudiosa' },
  { id: 'dolorosa', title: 'Dolorosa', icon: 'dolorosa' },
  { id: 'gloriosa', title: 'Gloriosa', icon: 'gloriosa' }
];

const bottomSections = [
  { id: 'ultima', title: 'Ultima', icon: 'ultima' },
  { id: 'proprium_missae', title: 'Proprium', icon: 'proprium' }
];

const renderNavIcon = (iconName: string) => {
  const cls = "w-5 h-5";
  switch (iconName) {
    case 'initium': return <InitiumIcon className={cls} />;
    case 'gaudiosa': return <GaudiosaIcon className={cls} />;
    case 'dolorosa': return <DolorosaIcon className={cls} />;
    case 'gloriosa': return <GloriosaIcon className={cls} />;
    case 'ultima': return <UltimaIcon className={cls} />;
    case 'proprium': return <PropriumIcon className={cls} />;
    default: return <span className="text-sm">✠</span>;
  }
};

export default function MobileBottomNav({ 
  currentSection, 
  onSectionChange, 
  onOpenIntentions,
  progress 
}: MobileBottomNavProps) {
  const getTodaysMystery = () => {
    const today = new Date().getDay();
    switch (today) {
      case 1:
      case 4:
        return 'gaudiosa';
      case 2:
      case 5:
        return 'dolorosa';
      case 0:
      case 3:
      case 6:
        return 'gloriosa';
      default:
        return 'gaudiosa';
    }
  };

  const todaysMystery = getTodaysMystery();

  const getProgressDots = (sectionId: string) => {
    if (!['gaudiosa', 'dolorosa', 'gloriosa'].includes(sectionId)) return null;
    const currentMystery = Math.min((progress[sectionId] || 0) + 1, 5);
    const dots = [];
    for (let i = 0; i < 5; i++) {
      dots.push(
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors duration-200",
            i < currentMystery ? "bg-[var(--ancient-gold-bright)]" : "bg-[var(--cathedral-stone-light)]/30"
          )}
        />
      );
    }
    return <div className="flex space-x-1 mt-0.5 justify-center">{dots}</div>;
  };

  const renderNavButton = (section: { id: string; title: string; icon: string }) => (
    <Button
      key={section.id}
      variant="ghost"
      size="sm"
      className={cn(
        "flex-1 flex flex-col items-center justify-center py-1.5 px-1 h-[3.4rem] transition-all duration-300 rounded-lg",
        currentSection === section.id
          ? "bg-byzantine-gold/20 border border-byzantine-gold/30 text-byzantine-gold"
          : "text-cathedral-stone-light hover:bg-byzantine-gold/10 hover:text-byzantine-gold"
      )}
      onClick={() => {
        onSectionChange(section.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-0.5 relative">
        {section.id === todaysMystery && (
          <div className="absolute -top-1 -right-1 z-10">
            <i className="fas fa-calendar-day text-ancient-gold text-[10px] drop-shadow-lg" title="Mistério de Hoje" />
          </div>
        )}
        <div>{renderNavIcon(section.icon)}</div>
        <span className="text-xs font-cinzel font-medium leading-tight text-center">
          {section.title}
        </span>
        {['gaudiosa', 'dolorosa', 'gloriosa'].includes(section.id) && (
          <div className="h-1.5 flex items-center justify-center">
            {getProgressDots(section.id)}
          </div>
        )}
      </div>
    </Button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-cathedral-black/95 backdrop-blur-lg border-t border-byzantine-gold/20">
      <div className="px-2 py-1.5 space-y-1">
        {/* Top Row: Prima, Gaudiosa, Dolorosa, Gloriosa */}
        <div className="flex items-stretch space-x-1">
          {topSections.map(renderNavButton)}
        </div>

        {/* Bottom Row: Ultima, Proprium, Intenções */}
        <div className="flex items-stretch space-x-1">
          {bottomSections.map(renderNavButton)}

          {/* Intentions Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 h-[3.4rem] text-cathedral-stone-light hover:bg-byzantine-gold/10 hover:text-byzantine-gold transition-all duration-300 rounded-lg"
            onClick={onOpenIntentions}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-0.5">
              <div>
                <IntentionsIcon className="w-5 h-5 text-byzantine-gold" />
              </div>
              <span className="text-xs font-cinzel font-medium leading-tight text-center">
                Intenções
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}