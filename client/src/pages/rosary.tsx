import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StarfieldBackground from "@/components/StarfieldBackground";
import RosarySidebar from "@/components/RosarySidebar";
import PrayerContent from "@/components/PrayerContent";
import IntentionsModal from "@/components/IntentionsModal";
import CustomPrayersModal from "@/components/CustomPrayersModal";
import FontSizeModal from "@/components/FontSizeModal";
import LoginDialog from "@/components/LoginDialog";
import MusicModal from "@/components/MusicModal";
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import { useIntentions } from "@/hooks/useIntentions";
import { useIsMobile } from "@/hooks/use-mobile";
// Image now served from public/assets directory
const prayingHandsImage = "/assets/praying-hands-rosary.png";


const sections = ['initium', 'gaudiosa', 'dolorosa', 'gloriosa', 'ultima'];

export default function RosaryPage() {
  const [currentSection, setCurrentSection] = useState('initium');
  const [intentionsModalOpen, setIntentionsModalOpen] = useState(false);
  const [customPrayersModalOpen, setCustomPrayersModalOpen] = useState(false);
  const [fontSizeModalOpen, setFontSizeModalOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({
    gaudiosa: 0,
    dolorosa: 0,
    gloriosa: 0
  });

  const { user, logout } = useAuth();
  const { 
    intentions, 
    addIntention, 
    removeIntention, 
    isAddingIntention 
  } = useIntentions(user?.id || null);
  const isMobile = useIsMobile();

  // Load progress from localStorage
  useEffect(() => {
    const storedProgress = localStorage.getItem('rosary_progress');
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const updateProgress = (section: string, completed: number) => {
    const newProgress = { ...progress, [section]: completed };
    setProgress(newProgress);
    localStorage.setItem('rosary_progress', JSON.stringify(newProgress));
  };

  const handleNext = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveIntentions = () => {
    // Intentions are automatically saved through the hook
    console.log('Intentions saved');
  };



  return (
    <>
      <StarfieldBackground />
      {/* Main Content Area - Responsive Layout */}
      <div className={isMobile ? "pb-32 pt-4" : ""}>
        {/* Desktop Sidebar - Hidden on Mobile */}
        {!isMobile && (
          <RosarySidebar 
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            onOpenIntentions={() => setIntentionsModalOpen(true)}
            progress={progress}
          />
        )}

        {/* Desktop Floating Controls - Only visible when sidebar is shown */}
        {!isMobile && (
          <div className="fixed top-6 left-0 w-96 z-50 px-6">
            <div className="space-y-4">
              {/* Font Settings and User Controls Row */}
              <div className="flex justify-center space-x-3">
                {/* Font Settings */}
                <Button 
                  variant="ghost"
                  size="sm"
                  className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 sacred-interactive"
                  onClick={() => setFontSizeModalOpen(true)}
                  title="Configurar Tamanho da Fonte"
                >
                  <i className="fas fa-font text-byzantine-gold text-sm sacred-icon-hover" />
                </Button>

                {/* Music Player in middle */}
                <MiniMusicPlayer
                  onOpenFullPlayer={() => setMusicModalOpen(true)}
                />
                
                {/* User Controls */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 sacred-interactive"
                        title="Perfil do Usuário"
                      >
                        <i className="fas fa-user text-byzantine-gold text-sm sacred-icon-hover" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="start" 
                      className="w-52 glass-morphism border-[var(--byzantine-gold-alpha)] bg-[var(--cathedral-shadow)] p-1"
                      sideOffset={8}
                    >
                      <div className="px-2 py-1.5 border-b border-[var(--byzantine-gold-alpha)]">
                        <p className="text-sm font-cinzel text-ancient-gold">{user.username}</p>
                        <p className="text-xs text-secondary">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-[var(--byzantine-gold-alpha)]" />
                      <DropdownMenuItem 
                        onClick={() => setCustomPrayersModalOpen(true)}
                        className="text-secondary hover:text-ancient-gold hover:bg-[var(--byzantine-gold-alpha)] transition-colors duration-200 cursor-pointer font-cinzel py-1.5"
                      >
                        <svg 
                          className="w-4 h-4 mr-2 text-current" 
                          viewBox="0 0 60 60" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M52.247,20.665c-0.803,0-1.544,0.257-2.154,0.687c0.041-0.223,0.069-0.452,0.069-0.687c0-2.073-1.68-3.752-3.753-3.752 c-2.073,0-3.753,1.68-3.753,3.752c0,0.114,0.017,0.224,0.027,0.335H34v-6.673c1.997-0.085,3.594-1.719,3.594-3.737 c0-2.073-1.68-3.753-3.753-3.753c-0.08,0-0.154,0.019-0.232,0.023c0.409-0.601,0.649-1.326,0.649-2.108 C34.258,2.68,32.578,1,30.505,1s-3.753,1.68-3.753,3.753c0,0.803,0.257,1.544,0.687,2.154c-0.223-0.042-0.452-0.069-0.687-0.069 C24.68,6.837,23,8.518,23,10.59c0,2.073,1.68,3.753,3.753,3.753c0.084,0,0.164-0.015,0.247-0.02V21h-9.673 c-0.085-1.997-1.719-3.594-3.737-3.594c-2.073,0-3.753,1.68-3.753,3.753c0,0.08,0.018,0.154,0.023,0.232 c-0.601-0.409-1.326-0.649-2.108-0.649C5.68,20.742,4,22.422,4,24.495s1.68,3.753,3.753,3.753c0.803,0,1.544-0.257,2.154-0.687 c-0.041,0.223-0.069,0.452-0.069,0.687c0,2.073,1.68,3.753,3.753,3.753c2.073,0,3.753-1.68,3.753-3.753 c0-0.084-0.015-0.165-0.02-0.247H27v17.682c-1.955,0.129-3.506,1.74-3.506,3.728c0,2.073,1.68,3.753,3.753,3.753 c0.08,0,0.154-0.019,0.232-0.023c-0.409,0.601-0.649,1.326-0.649,2.108c0,2.073,1.68,3.753,3.753,3.753s3.753-1.68,3.753-3.753 c0-0.803-0.257-1.544-0.687-2.154c0.223,0.041,0.452,0.069,0.687,0.069c2.073,0,3.753-1.68,3.753-3.753 c0-2.073-1.68-3.752-3.753-3.752c-0.114,0-0.223,0.017-0.335,0.027V28h8.682c0.129,1.956,1.74,3.506,3.728,3.506 c2.073,0,3.753-1.68,3.753-3.753c0-0.079-0.018-0.154-0.023-0.232c0.601,0.409,1.326,0.649,2.108,0.649 c2.073,0,3.753-1.68,3.753-3.752C56,22.345,54.32,20.665,52.247,20.665z"/>
                        </svg>
                        Adicionar Oração
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-secondary hover:text-ancient-gold hover:bg-[var(--byzantine-gold-alpha)] transition-colors duration-200 cursor-pointer font-cinzel py-1.5"
                      >
                        <i className="fas fa-sign-out-alt mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 sacred-interactive"
                    onClick={() => setLoginDialogOpen(true)}
                    title="Entrar"
                  >
                    <i className="fas fa-sign-in-alt text-byzantine-gold text-sm sacred-icon-hover" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile/Small Screen Floating Controls - Visible when sidebar is hidden */}
        {isMobile && (
          <div className="fixed top-4 left-0 right-0 z-50 px-4">
            <div className="flex items-center justify-center space-x-3">
              {/* Font Settings */}
              <Button 
                variant="ghost"
                size="sm"
                className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 sacred-interactive"
                onClick={() => setFontSizeModalOpen(true)}
                title="Configurar Tamanho da Fonte"
              >
                <i className="fas fa-font text-byzantine-gold text-sm sacred-icon-hover" />
              </Button>

              {/* Music Player - Compact for mobile */}
              <MiniMusicPlayer
                onOpenFullPlayer={() => setMusicModalOpen(true)}
              />
              
              {/* User Controls */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 sacred-interactive"
                      title="Perfil do Usuário"
                    >
                      <i className="fas fa-user text-byzantine-gold text-sm sacred-icon-hover" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-52 glass-morphism border-[var(--byzantine-gold-alpha)] bg-[var(--cathedral-shadow)] p-1"
                    sideOffset={8}
                  >
                    <div className="px-2 py-1.5 border-b border-[var(--byzantine-gold-alpha)]">
                      <p className="text-sm font-cinzel text-ancient-gold font-semibold">{user.username}</p>
                      <p className="text-xs text-secondary">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-[var(--byzantine-gold-alpha)]" />
                    <DropdownMenuItem 
                      onClick={() => setCustomPrayersModalOpen(true)}
                      className="text-secondary hover:text-ancient-gold hover:bg-[var(--byzantine-gold-alpha)] transition-colors duration-200 cursor-pointer font-cinzel py-1.5"
                    >
                      <i className="fas fa-cross mr-2" />
                      Adicionar Oração
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-secondary hover:text-ancient-gold hover:bg-[var(--byzantine-gold-alpha)] transition-colors duration-200 cursor-pointer font-cinzel py-1.5"
                    >
                      <i className="fas fa-sign-out-alt mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost"
                  size="sm"
                  className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 sacred-interactive"
                  onClick={() => setLoginDialogOpen(true)}
                  title="Entrar"
                >
                  <i className="fas fa-sign-in-alt text-byzantine-gold text-sm sacred-icon-hover" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Logo - Only visible on mobile */}
        {isMobile && (
          <div className="flex justify-center pt-24 pb-0">
            <div className="floating-logo-container">
              <img 
                src={prayingHandsImage} 
                alt="Sacred Rosary" 
                className="floating-sacred-logo w-32 h-32 object-contain"
              />
            </div>
          </div>
        )}

        {/* Prayer Content - Full width on mobile, with sidebar margin on desktop */}
        <div className={!isMobile ? "" : ""}>
          <PrayerContent 
            section={currentSection}
            onNext={handleNext}
            onPrevious={handlePrevious}
            intentions={intentions}
            progress={progress}
            onProgressUpdate={updateProgress}
          />
        </div>

        {/* Mobile Bottom Navigation - Only visible on mobile */}
        {isMobile && (
          <MobileBottomNav
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            onOpenIntentions={() => setIntentionsModalOpen(true)}
            progress={progress}
          />
        )}
      </div>
      <IntentionsModal 
       open={intentionsModalOpen}
       onOpenChange={setIntentionsModalOpen}
       intentions={intentions}
       onAddIntention={addIntention}
       onRemoveIntention={removeIntention}
       onSave={handleSaveIntentions}
     />
      <CustomPrayersModal 
        isOpen={customPrayersModalOpen}
        onClose={() => setCustomPrayersModalOpen(false)}
      />
      <FontSizeModal 
        open={fontSizeModalOpen}
        onOpenChange={setFontSizeModalOpen}
      />
      <MusicModal
        open={musicModalOpen}
        onOpenChange={setMusicModalOpen}
      />
      <LoginDialog 
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
      <Toaster />
    </>
  );
}
