import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import RosaryBeads from "./RosaryBeads";
import { 
  InitiumIcon, 
  GaudiosaIcon, 
  DolorosaIcon, 
  GloriosaIcon, 
  UltimaIcon, 
  IntentionsIcon,
  PropriumIcon
} from "./icons/RosaryIcons";

const prayingHandsImage = "/assets/praying-hands-rosary.png";

interface RosarySidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onOpenIntentions: () => void;
  progress: Record<string, number>;
}

const sections = [
  {
    id: 'initium',
    title: 'Prima Oratio',
    subtitle: 'Orações iniciais',
    icon: 'initium'
  },
  {
    id: 'gaudiosa',
    title: 'Mysteria Gaudiosa',
    subtitle: 'Mistérios Gozosos',
    icon: 'gaudiosa'
  },
  {
    id: 'dolorosa',
    title: 'Mysteria Dolorosa',
    subtitle: 'Mistérios Dolorosos',
    icon: 'dolorosa'
  },
  {
    id: 'gloriosa',
    title: 'Mysteria Gloriosa',
    subtitle: 'Mistérios Gloriosos',
    icon: 'gloriosa'
  },
  {
    id: 'ultima',
    title: 'Ultima Oratio',
    subtitle: 'Orações finais',
    icon: 'ultima'
  },
  {
    id: 'proprium_missae',
    title: 'Proprium Missae',
    subtitle: 'Liturgia Diária (1962)',
    icon: 'proprium'
  }
];

const renderSectionIcon = (icon: string, className: string = "w-5 h-5 flex-shrink-0 text-byzantine-gold sacred-icon-hover transition-all duration-300") => {
  switch (icon) {
    case 'initium': return <InitiumIcon className={className} />;
    case 'gaudiosa': return <GaudiosaIcon className={className} />;
    case 'dolorosa': return <DolorosaIcon className={className} />;
    case 'gloriosa': return <GloriosaIcon className={className} />;
    case 'ultima': return <UltimaIcon className={className} />;
    case 'proprium': return <PropriumIcon className={className} />;
    default: return null;
  }
};

export default function RosarySidebar({ 
  currentSection, 
  onSectionChange, 
  onOpenIntentions,
  progress
}: RosarySidebarProps) {
  const getCurrentDay = () => {
    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const mysteries = ['gloriosa', 'gaudiosa', 'dolorosa', 'gloriosa', 'dolorosa', 'dolorosa', 'gaudiosa'];
    const today = new Date().getDay();
    return { day: days[today], mystery: mysteries[today] };
  };

  const { day, mystery } = getCurrentDay();

  return (
    <aside className="fixed left-0 top-0 h-screen w-96 animate-slide-in-left">
      <ScrollArea className="h-full sacred-scroll">
        <div className="p-6 pt-44">
          {/* Sacred Logo */}
          <div className="text-center mb-8">
            <div className="floating-logo-container">
              <img 
                src={prayingHandsImage} 
                alt="Sacred Rosary" 
                loading="lazy"
                decoding="async"
                className="floating-sacred-logo w-64 h-64 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Rosary & Liturgy Navigation */}
          <nav className="space-y-3">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className={`w-full sacred-border p-3 h-auto hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-500 ease-in-out rounded-lg relative transform hover:scale-[1.02] sacred-interactive ${
                  currentSection === section.id 
                    ? 'today-mystery-highlight animate-glow-pulse scale-[1.02]' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => {
                  onSectionChange(section.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="flex items-center gap-3 w-full min-w-0">
                  {renderSectionIcon(section.icon)}
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="font-cinzel font-medium text-byzantine-gold text-lg leading-tight break-words">
                      {section.title}
                    </h3>
                    <p className="text-sm text-sacred-ivory/70 font-inter leading-tight break-words">
                      {section.subtitle}
                    </p>
                  </div>
                  {/* Today's Mystery Calendar Icon */}
                  {section.id === mystery && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--ancient-gold)] flex items-center justify-center animate-pulse-gentle" title="Mistério do Dia">
                      <i className="fas fa-calendar-alt text-xs text-[var(--cathedral-void)]" />
                    </div>
                  )}
                </div>

                {/* Show progress beads for mystery sections */}
                {(['gaudiosa', 'dolorosa', 'gloriosa'].includes(section.id)) && (
                  <div className="mt-4 -mb-1">
                    <RosaryBeads 
                      completed={Math.min((progress[section.id] || 0) + 1, 5)}
                      total={5}
                      size="sm"
                    />
                  </div>
                )}
              </Button>
            ))}

            {/* Prayer Intentions */}
            <Button
              variant="ghost"
              className="w-full sacred-border p-4 h-auto hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 bg-gradient-to-r from-[var(--byzantine-gold-alpha)] to-transparent rounded-lg sacred-interactive"
              onClick={onOpenIntentions}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <IntentionsIcon className="w-5 h-5 flex-shrink-0 text-byzantine-gold sacred-icon-hover transition-all duration-300" />
                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-cinzel font-medium text-byzantine-gold text-lg leading-tight break-words">Intentiones</h3>
                  <p className="text-sm text-sacred-ivory/70 font-inter leading-tight break-words">Intenções do Rosário</p>
                </div>
              </div>
            </Button>
          </nav>

          {/* Sacred Timeline */}
          <div className="mt-8 pt-6 border-t border-[var(--byzantine-gold-alpha)]">
            <h4 className="font-cinzel text-byzantine-gold mb-4 text-center text-[17px]">Mysterium Hodie</h4>
            <div className="text-center">
              <p className="text-sacred-ivory/70 font-inter mb-2 capitalize text-[15px]">
                {day}
              </p>
              <p className="font-medium capitalize text-[18px]">
                Mysteria {mystery}
              </p>
              <div className="w-8 h-8 mx-auto mt-3 rounded-full bg-gradient-to-r from-[var(--byzantine-gold)] to-[var(--byzantine-gold-alpha)] flex items-center justify-center">
                {renderSectionIcon(mystery, "w-4 h-4 text-[var(--cathedral-void)]")}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
