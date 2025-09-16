import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { rosaryContent } from "@/lib/rosaryData";
import { useFontSize } from "@/hooks/useFontSize";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useCustomPrayers } from "@/hooks/useCustomPrayers";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import RosaryBeads from "./RosaryBeads";
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface PrayerContentProps {
  section: string;
  onNext: () => void;
  onPrevious: () => void;
  intentions: Array<{ id: number; text: string }>;
  progress: Record<string, number>;
  onProgressUpdate: (section: string, completed: number) => void;
}

const sections = [
  {
    id: 'initium',
    title: 'Prima Oratio',
    subtitle: 'Orações iniciais',
    icon: 'custom-initium',
    portuguese: 'Início'
  },
  {
    id: 'gaudiosa',
    title: 'Mysteria Gaudiosa',
    subtitle: 'Mistérios Gozosos',
    icon: 'custom-gaudiosa',
    portuguese: 'Mysteria Gaudiosa'
  },
  {
    id: 'dolorosa',
    title: 'Mysteria Dolorosa',
    subtitle: 'Mistérios Dolorosos',
    icon: 'custom-dolorosa',
    portuguese: 'Mysteria Dolorosa'
  },
  {
    id: 'gloriosa',
    title: 'Mysteria Gloriosa',
    subtitle: 'Mistérios Gloriosos',
    icon: 'custom-gloriosa',
    portuguese: 'Mysteria Gloriosa'
  },
  {
    id: 'ultima',
    title: 'Ultima Oratio',
    subtitle: 'Orações finais',
    icon: 'custom-ultima',
    portuguese: 'Ultima Oratio'
  }
];

export default function PrayerContent({ 
  section, 
  onNext, 
  onPrevious, 
  intentions,
  progress,
  onProgressUpdate
}: PrayerContentProps) {
  const content = rosaryContent[section];
  const currentSectionData = sections.find(s => s.id === section);
  const { getFontSizeClass, getLineHeightClass, getLetterSpacingClass } = useFontSize();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { customPrayers } = useCustomPrayers(user?.id || null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Mobile language selection state - track selected language for each prayer card
  const [mobileLanguageSelection, setMobileLanguageSelection] = useState<Record<string, 'latin' | 'portuguese'>>({});
  
  // State for Angelus/Regina Coeli selection in Ultima section
  const [angelusReginaSelection, setAngelusReginaSelection] = useState<'angelus' | 'regina'>('angelus');

  // Helper function to get selected language for a prayer
  const getSelectedLanguage = (prayerKey: string): 'latin' | 'portuguese' => {
    if (!isMobile) return 'latin'; // Always show both on desktop
    return mobileLanguageSelection[prayerKey] || 'latin'; // Default to Latin on mobile
  };

  // Helper function to set language for a prayer
  const setSelectedLanguage = (prayerKey: string, language: 'latin' | 'portuguese') => {
    if (isMobile) {
      setMobileLanguageSelection(prev => ({
        ...prev,
        [prayerKey]: language
      }));
    }
  };

  // Component for language selection buttons
  const LanguageSelector = ({ prayerKey }: { prayerKey: string }) => {
    if (!isMobile) return null;

    const selectedLanguage = getSelectedLanguage(prayerKey);
    
    return (
      <div className="flex justify-center mb-4">
        <div className="flex bg-cathedral-dark/30 rounded-lg p-1 border border-ancient-gold/20">
          <button
            onClick={() => setSelectedLanguage(prayerKey, 'latin')}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
              selectedLanguage === 'latin'
                ? 'bg-ancient-gold/20 text-ancient-gold border border-ancient-gold/50 shadow-sm'
                : 'text-parchment/70 hover:text-parchment hover:bg-ancient-gold/10'
            }`}
          >
            Latim
          </button>
          <button
            onClick={() => setSelectedLanguage(prayerKey, 'portuguese')}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ml-1 ${
              selectedLanguage === 'portuguese'
                ? 'bg-ancient-gold/20 text-ancient-gold border border-ancient-gold/50 shadow-sm'
                : 'text-parchment/70 hover:text-parchment hover:bg-ancient-gold/10'
            }`}
          >
            Português
          </button>
        </div>
      </div>
    );
  };

  // Component for Angelus/Regina Coeli selection
  const AngelusReginaSelector = () => {
    if (section !== 'ultima') return null;
    
    return (
      <div className="flex justify-center mb-8">
        <div className="bg-cathedral-dark/30 rounded-lg p-2 border border-ancient-gold/20">
          <div className="text-center mb-3">
            <span className="text-ancient-gold/80 font-crimson text-sm">Tempo Litúrgico</span>
          </div>
          <div className="flex">
            <button
              onClick={() => setAngelusReginaSelection('angelus')}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                angelusReginaSelection === 'angelus'
                  ? 'bg-ancient-gold/20 text-ancient-gold border border-ancient-gold/50 shadow-sm'
                  : 'text-parchment/70 hover:text-parchment hover:bg-ancient-gold/10'
              }`}
            >
              Angelus
              <div className="text-xs mt-1 text-parchment/60">Tempo Comum</div>
            </button>
            <button
              onClick={() => setAngelusReginaSelection('regina')}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ml-2 ${
                angelusReginaSelection === 'regina'
                  ? 'bg-ancient-gold/20 text-ancient-gold border border-ancient-gold/50 shadow-sm'
                  : 'text-parchment/70 hover:text-parchment hover:bg-ancient-gold/10'
              }`}
            >
              Regina Coeli
              <div className="text-xs mt-1 text-parchment/60">Tempo Pascal</div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter custom prayers by section
  const getCustomPrayersForSection = (sectionType: string) => {
    return customPrayers.filter(prayer => prayer.section === sectionType);
  };

  // Filter prayers to show only selected Angelus or Regina Coeli
  const shouldShowPrayer = (prayerSection: any) => {
    if (section !== 'ultima') return true;
    
    if (prayerSection.title === 'Angelus' && angelusReginaSelection !== 'angelus') {
      return false;
    }
    if (prayerSection.title === 'Regina Coeli' && angelusReginaSelection !== 'regina') {
      return false;
    }
    
    return true;
  };

  // Render custom prayer card
  const renderCustomPrayerCard = (prayer: { id: number; title: string; content: string; section: string }) => (
    <Collapsible key={`custom-${prayer.id}`} defaultOpen={true}>
      <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up transition-all duration-700 ease-in-out">
        <CardContent className="p-8">
          <CollapsibleTrigger asChild>
            <div className="text-center mb-8 cursor-pointer group">
              <h2 className="font-cinzel text-2xl font-medium text-ancient-gold sacred-header-glow mb-3 flex items-center justify-center">
                <svg 
                  className="inline-block w-6 h-6 mr-3 text-ancient-gold sacred-icon-hover animate-sacred-icon-pulse" 
                  viewBox="0 0 60 60" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M52.247,20.665c-0.803,0-1.544,0.257-2.154,0.687c0.041-0.223,0.069-0.452,0.069-0.687c0-2.073-1.68-3.752-3.753-3.752 c-2.073,0-3.753,1.68-3.753,3.752c0,0.114,0.017,0.224,0.027,0.335H34v-6.673c1.997-0.085,3.594-1.719,3.594-3.737 c0-2.073-1.68-3.753-3.753-3.753c-0.08,0-0.154,0.019-0.232,0.023c0.409-0.601,0.649-1.326,0.649-2.108 C34.258,2.68,32.578,1,30.505,1s-3.753,1.68-3.753,3.753c0,0.803,0.257,1.544,0.687,2.154c-0.223-0.042-0.452-0.069-0.687-0.069 C24.68,6.837,23,8.518,23,10.59c0,2.073,1.68,3.753,3.753,3.753c0.084,0,0.164-0.015,0.247-0.02V21h-9.673 c-0.085-1.997-1.719-3.594-3.737-3.594c-2.073,0-3.753,1.68-3.753,3.753c0,0.08,0.018,0.154,0.023,0.232 c-0.601-0.409-1.326-0.649-2.108-0.649C5.68,20.742,4,22.422,4,24.495s1.68,3.753,3.753,3.753c0.803,0,1.544-0.257,2.154-0.687 c-0.041,0.223-0.069,0.452-0.069,0.687c0,2.073,1.68,3.753,3.753,3.753c2.073,0,3.753-1.68,3.753-3.753 c0-0.084-0.015-0.165-0.02-0.247H27v17.682c-1.955,0.129-3.506,1.74-3.506,3.728c0,2.073,1.68,3.753,3.753,3.753 c0.08,0,0.154-0.019,0.232-0.023c-0.409,0.601-0.649,1.326-0.649,2.108c0,2.073,1.68,3.753,3.753,3.753s3.753-1.68,3.753-3.753 c0-0.803-0.257-1.544-0.687-2.154c0.223,0.041,0.452,0.069,0.687,0.069c2.073,0,3.753-1.68,3.753-3.753 c0-2.073-1.68-3.752-3.753-3.752c-0.114,0-0.223,0.017-0.335,0.027V28h8.682c0.129,1.956,1.74,3.506,3.728,3.506 c2.073,0,3.753-1.68,3.753-3.753c0-0.079-0.018-0.154-0.023-0.232c0.601,0.409,1.326,0.649,2.108,0.649 c2.073,0,3.753-1.68,3.753-3.752C56,22.345,54.32,20.665,52.247,20.665z"/>
                </svg>
                <span>{prayer.title}</span>
                <ChevronDown className="w-5 h-5 ml-3 text-ancient-gold transition-transform duration-200 group-data-[state=closed]:rotate-180" />
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full"></div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="prayer-grid">
              {/* Single Column for Custom Prayer */}
              <div className="prayer-column col-span-2">
                <div className="prayer-content">
                  <div 
                    className={`prayer-portuguese ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {prayer.content}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );

  // Helper function to render custom icons
  const renderIcon = (iconClass: string, className: string = "") => {
    if (iconClass === 'custom-initium') {
      return (
        <svg 
          className={`inline-block ${className}`}
          viewBox="0 0 512 512" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0,512) scale(0.1,-0.1)">
            <path d="M2369 4781 c-24 -19 -24 -23 -27 -220 l-3 -201 -255 0 c-241 0 -255 -1 -274 -20 -19 -19 -20 -33 -20 -199 l0 -180 26 -20 c25 -20 39 -21 275 -21 l249 0 2 -726 3 -726 24 -19 c21 -17 41 -19 196 -19 l174 0 20 26 c21 26 21 33 21 745 l0 719 249 0 c250 0 250 0 278 24 28 24 28 25 31 166 4 161 -1 203 -29 231 -18 18 -35 19 -274 19 l-255 0 0 194 c0 180 -1 195 -21 220 l-20 26 -174 0 c-155 0 -175 -2 -196 -19z m261 -325 c0 -176 2 -196 19 -217 19 -24 20 -24 280 -27 l261 -3 0 -69 0 -70 -259 0 -260 0 -20 -26 c-21 -26 -21 -33 -21 -745 l0 -719 -70 0 -70 0 0 723 0 724 -23 21 c-22 21 -32 22 -277 24 l-255 3 -3 67 -3 67 261 3 c261 3 262 3 281 27 17 21 19 41 19 217 l0 194 70 0 70 0 0 -194z"/>
            <path d="M1775 2346 c-108 -21 -186 -51 -360 -136 -251 -123 -412 -180 -564 -199 -50 -6 -80 -16 -93 -28 -12 -13 -28 -63 -46 -146 l-27 -127 -91 0 c-73 0 -96 -4 -113 -18 -19 -15 -41 -106 -156 -642 -74 -344 -135 -640 -135 -658 0 -46 30 -72 82 -72 24 0 205 9 403 20 198 11 446 24 550 30 105 6 307 17 450 25 143 8 409 22 590 31 l330 16 1111 -61 c612 -33 1128 -61 1148 -61 46 0 76 29 76 72 0 18 -61 314 -135 658 -115 536 -137 627 -156 642 -17 14 -40 18 -113 18 l-91 0 -27 127 c-18 83 -34 133 -46 146 -13 12 -43 22 -93 28 -152 19 -313 76 -564 199 -181 89 -277 123 -396 141 -222 32 -470 -41 -668 -197 l-81 -64 -83 65 c-97 77 -234 147 -344 176 -101 26 -265 33 -358 15z m287 -151 c136 -28 258 -92 364 -188 l64 -59 0 -389 c0 -214 -4 -389 -9 -389 -4 0 -41 15 -82 34 -150 69 -324 103 -461 92 -145 -12 -251 -44 -500 -150 -166 -71 -320 -116 -482 -141 -120 -19 -276 -33 -276 -25 0 8 180 843 186 862 3 10 17 21 32 24 207 44 329 89 600 218 156 75 235 104 322 119 56 10 179 6 242 -8z m1323 -10 c33 -9 140 -55 237 -101 271 -130 393 -174 600 -218 15 -3 29 -14 32 -24 5 -16 186 -852 186 -859 0 -8 -103 -2 -200 12 -236 33 -370 71 -590 165 -176 75 -274 107 -385 127 -164 28 -349 2 -519 -73 -45 -19 -87 -38 -93 -41 -10 -4 -13 78 -13 390 l0 395 59 54 c100 90 223 154 355 184 76 17 247 12 331 -11z m-2735 -629 c0 -2 -31 -149 -69 -327 -83 -387 -113 -549 -109 -591 2 -20 13 -38 30 -51 27 -20 33 -20 185 -9 344 25 548 72 839 192 252 105 317 122 464 124 161 1 273 -32 459 -135 49 -27 99 -49 110 -49 10 0 71 27 134 60 321 169 503 170 882 8 300 -129 489 -174 846 -200 165 -11 170 -11 197 9 17 13 28 31 30 51 4 42 -26 206 -108 590 -39 177 -70 325 -70 327 0 3 15 5 33 5 l32 0 113 -533 c62 -292 113 -538 112 -545 0 -9 -16 -11 -62 -7 -35 3 -187 12 -338 20 -151 8 -302 21 -335 29 -102 25 -234 75 -385 148 -193 92 -283 119 -432 125 -217 10 -422 -45 -609 -163 l-37 -23 -79 45 c-104 59 -217 102 -333 126 -77 16 -120 19 -225 15 -162 -6 -244 -29 -445 -125 -151 -73 -283 -123 -385 -148 -33 -8 -179 -21 -325 -29 -146 -8 -298 -17 -337 -19 -54 -4 -73 -3 -73 7 -1 6 50 252 112 544 l113 533 33 0 c17 0 32 -2 32 -4z m1483 -420 c94 -18 216 -66 315 -124 100 -58 124 -58 224 0 168 98 339 145 493 135 117 -8 229 -41 445 -132 189 -79 267 -105 411 -135 115 -24 313 -50 378 -50 26 0 54 -6 63 -12 16 -13 34 -98 21 -98 -5 0 -71 7 -148 15 -285 30 -426 66 -694 177 -289 119 -437 150 -614 128 -117 -14 -229 -50 -359 -115 l-108 -54 -107 54 c-201 99 -370 135 -546 116 -125 -14 -230 -46 -428 -129 -273 -116 -442 -156 -782 -187 l-67 -6 6 43 c8 54 26 68 85 68 67 0 265 27 379 51 138 30 263 72 448 150 143 61 258 98 342 112 57 10 173 6 243 -7z m-81 -486 c86 -10 255 -56 244 -67 -5 -6 -612 -42 -696 -42 l-45 0 55 29 c70 36 177 68 261 79 90 12 85 12 181 1z m1298 -21 c41 -11 107 -35 145 -53 l70 -34 -45 -1 c-77 -1 -691 36 -696 42 -10 10 157 58 230 66 91 11 201 4 296 -20z"/>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-gaudiosa') {
      return (
        <svg 
          className={`inline-block ${className}`}
          viewBox="0 0 512 512" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M260.72 29.094c-54.533 0-98.97 21.704-98.97 48.312 0 26.61 44.437 48.28 98.97 48.28 54.53 0 98.967-21.67 98.967-48.28S315.25 29.094 260.72 29.094zm0 13.25c40.07 0 71.81 15.508 71.81 35.062s-31.74 35.47-71.81 35.47c-40.073 0-72.69-15.916-72.69-35.47 0-19.552 32.617-35.064 72.69-35.062zM86.53 57.187c-13.242-.094-32.234 14.59-42.31 37.688-43.3 99.244-9.583 359.695 87.874 351.97-22.002-50.492-43.8-107.983-56.72-168.75 26.337 72.494 72.33 135.58 117.845 120.186-32.017-40.185-66.048-87.265-90.032-140.342 35.016 59.175 85.37 105.853 123.03 85.5-29.742-26.583-61.568-57.524-88.812-93.25 39.647 37.38 87.092 61.34 112.25 37.75-47.69-21.07-94.37-53.67-125.062-89.75-16.312-19.176-28.195-39.39-32.72-60-2.26-10.306-2.508-20.796-.468-30.938.02-.095.043-.186.063-.28.007-.044.022-.083.03-.126 4.05-21.265 15.043-35.413 4.5-45.97-2.484-2.487-5.76-3.66-9.47-3.687zm347.658 0c-3.71.027-6.954 1.2-9.438 3.688-8.176 8.186-3.416 18.564 1.03 32.72 6.153 14.187 7.144 29.566 3.845 44.593-4.524 20.61-16.44 40.824-32.75 60-30.798 36.206-77.67 68.907-125.53 89.968 25.22 23.208 72.482-.71 112-37.97-27.245 35.728-59.07 66.67-88.814 93.25 37.662 20.355 88.016-26.323 123.033-85.498-23.985 53.077-58.016 100.157-90.032 140.343 45.515 15.395 91.478-47.69 117.814-120.186-12.918 60.768-34.686 118.26-56.688 168.75 97.457 7.726 131.142-252.725 87.844-351.97-10.077-23.097-29.07-37.78-42.313-37.686zm-22.22 73.97c-100.397 68.228-200.733 82.462-301.25 5.468 4.02 15.655 13.89 32.733 28.126 49.47 28.922 34 75.48 66.378 121.906 86.31 46.426-19.932 92.984-52.31 121.906-86.31 14.98-17.613 25.138-35.594 28.72-51.907.223-1.02.416-2.027.593-3.032z"/>
        </svg>
      );
    }
    if (iconClass === 'custom-dolorosa') {
      return (
        <svg 
          className={`inline-block ${className}`}
          viewBox="0 0 480 480" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0 -1020.36)">
            <path d="M208,1020.362c-4.418,0-8,3.582-8,8v104h-56c0-4.418-3.582-8-8-8H88c-4.418,0-8,3.582-8,8H56 c-4.418,0-8,3.582-8,8v64c0,4.418,3.582,8,8,8h24v80c0,4.418,3.582,8,8,8h48c4.418,0,8-3.582,8-8v-38.377 c12.851,21.34,32.573,37.975,56,46.969v191.406c0,4.418,3.582,8,8,8h64c4.418,0,8-3.582,8-8v-191.5 c23.546-9.049,43.2-25.777,56-47.125v38.625c0,4.418,3.582,8,8,8h48c4.418,0,8-3.582,8-8v-80h24c4.418,0,8-3.582,8-8v-64 c0-4.418-3.582-8-8-8h-24c0-4.418-3.582-8-8-8h-48c-4.418,0-8,3.582-8,8h-56v-104c0-4.418-3.582-8-8-8L208,1020.362z M216,1036.362 h48v104c0,4.418,3.582,8,8,8h64v48h-64c-4.418,0-8,3.582-8,8c-0.056,13.93-0.004,28.961-0.085,42.25 c-7.686,3.719-15.788,5.904-24.844,5.75c-8.357-0.16-15.639-2.293-22.749-5.719c-0.024-14.002-0.291-28.16-0.291-42.156 c0-4.418-3.582-8-8-8h-64v-48.125h64c4.418,0,8-3.582,8-8L216,1036.362z M64,1148.362h16v48H64V1148.362z M400,1148.362h16v48h-16 V1148.362z M280,1212.362h13.437c-2.629,8.832-7.27,16.602-13.437,22.938V1212.362z M186.437,1212.522H200v22.844 C193.822,1229.026,189.066,1221.319,186.437,1212.522z M216,1305.676c8.547,1.885,17.41,2.895,26.531,2.688 c7.355-0.16,14.531-1.072,21.469-2.594v178.594h-48V1305.676z"/>
            <g>
              <path d="M96.139,1140.358h31.749l0.16,143.996h-32L96.139,1140.358z"/>
              <path d="M352.139,1140.358h31.749l0.16,144h-32L352.139,1140.358z"/>
              <path d="M309.92,1212.358h24.688c-7.478,44.68-45.645,78.943-92.438,80 c-48.24,1.088-88.923-33.477-96.749-79.875h24.718c7.357,31.871,35.379,55.314,68.656,55.875 C272.938,1268.934,302.39,1245.27,309.92,1212.358L309.92,1212.358z"/>
            </g>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-gloriosa') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeMiterlimit="10"
        >
          <g>
            <polygon points="20.5,23.5 19,20.5 23.5,14.5 19.5,10 16,14 17.5,15.5 19,14 15,8 12,11.5 9,8 5,14 6.5,15.5 8,14 4.5,10 0.5,14.5 5,20.5 3.5,23.5"/>
            <line x1="12" y1="10.917" x2="12" y2="0.5"/>
            <line x1="8.5" y1="3.5" x2="15.5" y2="3.5"/>
            <line x1="5" y1="20.5" x2="19" y2="20.5"/>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-angel') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 512 512" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0,512) scale(0.1,-0.1)">
            <path d="M2435 5014 c-16 -2 -70 -13 -120 -24 -348 -78 -400 -330 -92 -445 305 -113 767 -41 857 135 66 130 -45 256 -275 311 -87 20 -297 34 -370 23z m287 -129 c151 -26 258 -82 258 -134 0 -28 -66 -75 -143 -100 -214 -70 -523 -47 -656 50 -49 35 -52 61 -11 99 86 80 348 121 552 85z"/>
            <path d="M2443 4286 c-127 -31 -264 -137 -325 -252 -104 -194 -65 -438 95 -596 l58 -57 -56 -26 c-72 -34 -156 -112 -202 -187 l-37 -60 -26 33 c-109 146 -255 252 -437 318 -43 16 -189 52 -324 80 -369 76 -492 124 -599 231 -66 67 -102 130 -129 230 -27 98 -61 123 -109 83 -35 -30 -118 -188 -153 -290 -29 -88 -33 -110 -33 -208 0 -121 11 -164 64 -241 16 -25 30 -48 30 -51 0 -3 -22 -3 -49 1 -59 8 -99 -8 -107 -41 -8 -32 13 -144 43 -223 67 -182 217 -349 386 -431 26 -13 47 -26 47 -30 0 -3 -20 -14 -45 -23 -45 -18 -85 -56 -85 -83 0 -8 24 -39 53 -70 188 -200 519 -346 902 -398 66 -9 130 -19 142 -21 l23 -4 -20 -51 c-66 -166 38 -345 211 -366 27 -3 52 -9 54 -14 3 -4 -58 -250 -135 -546 -122 -463 -141 -546 -137 -594 8 -95 68 -182 152 -220 44 -19 180 -41 380 -61 171 -17 798 -16 970 0 180 18 334 41 371 57 45 19 112 82 137 129 44 83 37 126 -116 704 -76 287 -135 527 -132 532 3 6 23 10 43 10 20 0 57 10 82 21 133 60 191 202 141 346 -21 61 -25 58 84 68 274 25 598 135 800 270 86 58 215 183 215 208 0 27 -40 65 -85 83 -25 9 -45 20 -45 23 0 4 21 17 48 30 166 81 312 241 381 420 33 86 56 199 47 234 -8 33 -48 49 -107 41 -27 -4 -49 -4 -49 0 0 3 13 24 29 47 50 68 66 131 65 249 0 91 -5 118 -34 203 -34 102 -117 260 -152 290 -48 40 -82 15 -109 -83 -28 -101 -63 -164 -131 -231 -109 -108 -228 -154 -597 -230 -135 -28 -281 -64 -324 -80 -182 -66 -328 -172 -438 -318 l-25 -34 -27 45 c-46 79 -121 153 -197 192 l-70 37 57 57 c132 130 183 319 134 494 -71 257 -340 416 -598 354z"/>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-pater') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 512 512" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 239.5,-0.5 C 250.167,-0.5 260.833,-0.5 271.5,-0.5C 334.87,10.8687 372.87,48.202 385.5,111.5C 385.167,116.5 382.5,119.167 377.5,119.5C 374.889,119.444 372.722,118.444 371,116.5C 357.311,54.3069 318.811,20.3069 255.5,14.5C 204.513,17.3436 168.68,42.0102 148,88.5C 132.112,135.403 141.112,176.737 175,212.5C 169.275,183.506 167.275,154.173 169,124.5C 170.726,93.8909 182.559,68.0576 204.5,47C 222.033,36.4188 239.033,37.2521 255.5,49.5C 278.982,33.8952 299.815,36.8952 318,58.5C 336.334,84.6494 344.5,113.816 342.5,146C 342.338,168.443 340.172,190.61 336,212.5C 355.373,192.753 367.04,169.086 371,141.5C 376.033,137.221 380.7,137.554 385,142.5C 381.948,180.879 365.114,211.712 334.5,235C 337.144,247.455 342.644,258.622 351,268.5C 375.025,297.926 404.191,320.759 438.5,337C 444.535,342.061 447.201,348.561 446.5,356.5C 453.437,351.405 460.77,346.905 468.5,343C 488.031,341.198 496.865,350.031 495,369.5C 493.024,374.954 489.524,379.121 484.5,382C 490.991,385.078 497.325,388.412 503.5,392C 507.286,395.586 509.953,399.753 511.5,404.5C 511.5,407.5 511.5,410.5 511.5,413.5C 500.409,443.874 480.409,451.708 451.5,437C 442.709,431.206 434.209,425.039 426,418.5C 419.738,425.765 412.571,431.932 404.5,437C 402.047,437.738 399.547,438.238 397,438.5C 377.413,434.706 360.08,426.372 345,413.5C 345.868,424.653 347.868,435.653 351,446.5C 355.898,464.194 361.398,481.694 367.5,499C 366.949,504.62 364.282,508.786 359.5,511.5C 344.5,511.5 329.5,511.5 314.5,511.5C 310.3,507.982 309.467,503.649 312,498.5C 312.75,497.874 313.584,497.374 314.5,497C 326.181,496.833 337.848,496.333 349.5,495.5C 336.943,463.272 329.11,429.939 326,395.5C 325.072,388.06 325.406,380.726 327,373.5C 330.716,371.066 334.549,370.899 338.5,373C 339.893,374.171 340.727,375.671 341,377.5C 341.333,381.167 341.667,384.833 342,388.5C 356.947,404.938 375.113,416.271 396.5,422.5C 411.404,412.726 420.904,399.06 425,381.5C 428.339,371.145 429.506,360.645 428.5,350C 392.413,333.248 362.246,309.081 338,277.5C 335.206,350.555 312.539,416.555 270,475.5C 264.541,482.627 258.708,489.461 252.5,496C 264.167,496.333 275.833,496.667 287.5,497C 292.768,501.829 292.768,506.663 287.5,511.5C 240.167,511.5 192.833,511.5 145.5,511.5C 140.463,508.956 136.963,504.956 135,499.5C 134.333,487.5 134.333,475.5 135,463.5C 136.405,456.424 139.905,450.591 145.5,446C 151.303,442.362 156.97,438.529 162.5,434.5C 164.753,427.647 165.92,420.647 166,413.5C 150.92,426.372 133.587,434.706 114,438.5C 109.338,438.295 105.171,436.795 101.5,434C 95.6771,429.177 90.1771,424.01 85,418.5C 73.3778,429.066 60.2111,437.233 45.5,443C 29.2102,447.269 16.3769,442.436 7,428.5C 3.92666,423.687 1.42666,418.687 -0.5,413.5C -0.5,410.5 -0.5,407.5 -0.5,404.5C 0.83408,399.028 3.83408,394.528 8.5,391C 14.5,388 20.5,385 26.5,382C 16.7826,376.205 13.2826,367.705 16,356.5C 21.1896,344.988 30.023,340.488 42.5,343C 50.2296,346.905 57.563,351.405 64.5,356.5C 63.7987,348.561 66.4654,342.061 72.5,337C 115.102,317.062 148.936,287.228 174,247.5C 176.039,245.126 178.372,243.126 181,241.5C 181.492,240.451 181.326,239.451 180.5,238.5C 135.517,204.082 117.684,158.749 127,102.5C 139.423,54.4141 168.923,21.9141 215.5,5C 223.563,2.82468 231.563,0.991345 239.5,-0.5 Z M 185.5,126.5 C 186.365,100.378 196.031,78.2112 214.5,60C 227.008,53.2891 238.341,54.9558 248.5,65C 252.375,66.5204 256.375,66.8538 260.5,66C 264.11,64.056 267.443,61.7226 270.5,59C 279.366,54.1235 288.032,54.4569 296.5,60C 311.574,74.3107 320.74,91.8107 324,112.5C 324.715,117.4 325.548,122.233 326.5,127C 323.973,126.089 321.306,125.089 318.5,124C 315.183,123.502 311.85,123.335 308.5,123.5C 308.616,118.898 306.949,115.065 303.5,112C 294.517,109.666 285.517,107.333 276.5,105C 270.731,101.232 266.398,96.2319 263.5,90C 253.741,84.7391 246.907,87.2391 243,97.5C 240.463,100.372 237.63,102.872 234.5,105C 225.524,107.477 216.524,109.81 207.5,112C 204.051,115.065 202.384,118.898 202.5,123.5C 196.531,122.994 190.865,123.994 185.5,126.5 Z"/>
        </svg>
      );
    }
    if (iconClass === 'custom-intentions') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 25.708 25.708" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="12.855" cy="5.772" rx="1.804" ry="0.451"/>
          <path d="M13.618,4.488c0.1-0.208,0.18-0.449,0.22-0.737C13.955,2.89,13.648,1.854,12.842,0c-0.299,2.183-0.993,2.402-0.993,3.751
            c0,0.296,0.075,0.537,0.179,0.746C10.773,4.64,9.85,5.099,9.85,5.647v9.526c0.196,0.261,0.314,0.563,0.314,0.916v8.416
            c0,0.166-0.034,0.32-0.081,0.465c0.456,0.433,1.524,0.737,2.771,0.737c1.247,0,2.316-0.305,2.771-0.737
            c-0.047-0.147-0.079-0.299-0.079-0.465v-8.416c0-0.353,0.118-0.655,0.313-0.916V5.647C15.86,5.088,14.906,4.624,13.618,4.488z
             M12.855,6.501c-1.72,0-2.658-0.564-2.658-0.854c0-0.255,0.721-0.721,2.058-0.832c0.167,0.16,0.364,0.268,0.587,0.268
            c0.225,0,0.404-0.109,0.557-0.27c1.37,0.103,2.113,0.575,2.113,0.833C15.514,5.937,14.575,6.501,12.855,6.501z"/>
          <path d="M6.972,14.931c0.101-0.208,0.181-0.449,0.221-0.737c0.116-0.861-0.191-1.897-0.995-3.751
            c-0.3,2.184-0.995,2.401-0.995,3.751c0,0.296,0.077,0.536,0.18,0.746c-1.255,0.143-2.179,0.602-2.179,1.149v8.416
            c0,0.664,1.346,1.202,3.006,1.202c1.659,0,3.005-0.538,3.005-1.202v-8.416C9.214,15.532,8.26,15.067,6.972,14.931z M6.21,16.945
            c-1.72,0-2.66-0.564-2.66-0.854c0-0.257,0.722-0.722,2.06-0.832c0.167,0.159,0.364,0.269,0.588,0.269
            c0.224,0,0.403-0.11,0.557-0.271c1.371,0.104,2.114,0.575,2.114,0.834C8.868,16.38,7.93,16.945,6.21,16.945z"/>
          <ellipse cx="6.21" cy="16.214" rx="1.804" ry="0.451"/>
          <path d="M20.262,14.931c0.1-0.208,0.182-0.449,0.22-0.737c0.117-0.861-0.19-1.897-0.995-3.751
            c-0.299,2.184-0.994,2.401-0.994,3.751c0,0.296,0.076,0.536,0.179,0.746c-1.255,0.143-2.179,0.602-2.179,1.149v8.416
            c0,0.664,1.347,1.202,3.005,1.202c1.661,0,3.007-0.538,3.007-1.202v-8.416C22.506,15.532,21.551,15.067,20.262,14.931z
             M19.5,16.945c-1.72,0-2.657-0.564-2.657-0.854c0-0.257,0.722-0.722,2.058-0.832c0.166,0.159,0.363,0.269,0.589,0.269
            c0.225,0,0.403-0.11,0.556-0.271c1.369,0.104,2.115,0.575,2.115,0.834C22.16,16.38,21.22,16.945,19.5,16.945z"/>
          <ellipse cx="19.5" cy="16.214" rx="1.804" ry="0.451"/>
        </svg>
      );
    }
    if (iconClass === 'custom-ave-maria') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 250 250" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0,250) scale(0.1,-0.1)">
            <path d="M1176 2380 c-71 -12 -168 -64 -211 -111 -21 -23 -49 -67 -64 -98 -22
            -48 -26 -70 -26 -153 0 -97 0 -97 -35 -134 -19 -20 -55 -46 -80 -58 l-45 -21
            -7 -73 c-8 -92 -45 -171 -109 -231 l-47 -44 14 -40 c27 -77 12 -168 -42 -250
            -19 -29 -22 -42 -14 -57 17 -31 11 -93 -13 -135 l-23 -40 20 -35 c26 -44 27
            -131 2 -178 -17 -33 -17 -33 9 -64 24 -28 26 -38 24 -97 -3 -59 0 -70 23 -101
            38 -51 50 -87 47 -154 -2 -53 0 -60 24 -78 14 -10 36 -35 48 -55 21 -34 23
            -35 30 -14 5 11 13 21 19 21 13 0 13 -17 0 -25 -22 -14 -8 -22 28 -16 35 6 40
            11 79 88 41 77 93 241 93 291 0 49 -18 16 -53 -96 -33 -106 -126 -312 -113
            -252 14 70 126 636 139 707 8 45 27 106 41 135 l26 53 -5 -40 c-3 -22 -9 -168
            -14 -325 -8 -253 -12 -298 -36 -403 -27 -118 -30 -181 -7 -124 36 87 54 235
            63 522 10 340 16 402 37 410 12 4 13 -2 8 -37 -4 -24 -11 -176 -16 -338 -9
            -288 -16 -360 -45 -484 -18 -75 -19 -99 -3 -94 19 7 57 173 68 303 6 66 13
            144 16 173 l6 53 69 45 69 44 0 47 0 48 19 -32 c21 -34 20 -66 -15 -251 -9
            -46 -13 -86 -11 -89 3 -2 8 14 12 36 13 76 25 54 26 -46 1 -54 5 -123 9 -153
            6 -35 7 22 5 162 -3 133 -1 220 5 223 6 4 10 -8 10 -26 0 -77 23 -211 37 -216
            27 -11 34 21 31 154 -2 84 0 126 6 115 5 -9 11 -95 14 -192 4 -164 3 -181 -22
            -279 -15 -57 -25 -105 -23 -107 2 -2 19 50 37 116 32 116 33 123 26 246 -3 69
            -9 160 -13 201 l-6 76 71 -38 c39 -20 78 -47 86 -59 11 -18 15 -74 18 -272 2
            -173 7 -255 15 -269 18 -30 17 727 -1 845 -13 85 -12 106 3 81 24 -39 35 -202
            36 -531 1 -402 2 -410 16 -410 15 0 5 804 -11 879 -6 29 -9 55 -7 58 3 2 25
            -6 49 -19 29 -15 43 -30 43 -43 0 -15 7 -20 26 -20 32 0 53 -17 81 -66 27 -49
            52 -54 36 -7 -24 68 -163 170 -283 207 l-53 17 59 104 c63 113 67 133 44 201
            -28 78 -63 230 -85 364 -26 157 -44 217 -81 272 -36 51 -77 82 -143 104 l-51
            18 50 0 c62 1 127 -31 167 -80 21 -27 34 -61 52 -149 51 -239 99 -347 187
            -421 108 -91 127 -115 148 -187 94 -315 112 -502 64 -672 -25 -90 -26 -107
            -27 -328 0 -271 2 -278 70 -211 27 26 53 42 78 46 21 3 35 10 32 17 -31 73
            -48 154 -44 220 3 72 9 87 72 171 6 8 1 39 -14 85 -30 94 -31 198 -1 264 l20
            47 -34 52 c-64 98 -82 237 -44 345 11 32 10 34 -31 69 -80 69 -140 190 -140
            285 0 47 -1 48 -48 72 -54 27 -119 94 -126 128 -3 13 -7 53 -9 90 -6 84 -36
            147 -99 211 -86 86 -214 127 -332 107z"/>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-ultima') {
      return (
        <svg 
          className={`inline-block ${className}`}
          viewBox="0 0 440 440" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0 -1020.36)">
            <path d="M64,1020.36c-4.418,0-7.998,3.582-8,8v424c0.002,4.418,3.582,8,8,8h264c30.834,0,56-25.166,56-56 c0-111.969,0-224.082,0-335.996c0-2.4-0.784-6.313-1.536-8.594c-7.666-23.444-28.674-39.406-54.469-39.406L64,1020.36z M72,1036.36 h256c22.187,0,40,17.813,40,40v280c0,22.188-17.813,40-40,40H72L72,1036.36z"/>
            <g>
              <path d="M362.763,1399.887c-6.834,12.189-19.707,20.469-34.75,20.469h-256v-8h256 C341.192,1412.356,353.178,1407.561,362.763,1399.887z"/>
              <path d="M362.763,1423.887c-6.834,12.189-19.707,20.469-34.75,20.469h-256v-8h256 C341.192,1436.356,353.178,1431.561,362.763,1423.887z"/>
            </g>
            <path d="M215.893,1095.887c-4.406,0.068-7.927,3.688-7.875,8.094v39.875h-39.875 c-4.418-0.063-8.051,3.469-8.113,7.887s3.469,8.051,7.887,8.113c0.075,0.002,0.151,0.002,0.226,0h39.875v87.906 c-0.063,4.418,3.468,8.051,7.886,8.113s8.051-3.467,8.114-7.887c0.001-0.074,0.001-0.15,0-0.227v-87.906h39.875 c4.418,0.063,8.051-3.469,8.113-7.887c0.062-4.418-3.469-8.051-7.887-8.113c-0.075-0.002-0.151-0.002-0.226,0h-39.875v-39.875 c0.052-4.418-3.488-8.043-7.906-8.094C216.038,1095.885,215.966,1095.885,215.893,1095.887L215.893,1095.887z"/>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-gloria-patri') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 512 512" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(0,512) scale(0.1,-0.1)">
            <path d="M2515 4831 c-11 -5 -65 -49 -120 -98 -289 -260 -539 -634 -680 -1017 -51 -138 -110 -376 -131 -531 -19 -139 -25 -439 -12 -596 l8 -86 -173 -86 c-288 -143 -499 -298 -722 -529 -331 -343 -554 -756 -660 -1224 -31 -137 -31 -155 1 -193 20 -24 49 -38 132 -65 461 -149 946 -164 1429 -46 277 68 593 208 829 366 71 47 134 88 140 91 6 2 46 -20 87 -51 247 -176 574 -325 892 -406 218 -55 373 -73 630 -74 305 -1 515 30 777 114 136 43 178 73 178 127 0 42 -49 250 -87 368 -215 669 -728 1243 -1383 1548 l-112 52 6 45 c3 25 9 122 12 215 28 740 -283 1481 -826 1975 -120 109 -155 125 -215 101z"/>
            <path d="M2522 3830 c-26 -11 -39 -38 -82 -177 -55 -177 -119 -221 -221 -154 -24 16 -57 43 -73 60 -40 41 -95 43 -125 5 -12 -15 -21 -35 -21 -45 0 -37 190 -524 211 -541 19 -16 51 -18 349 -18 298 0 330 2 349 18 21 17 211 504 211 541 0 10 -9 30 -21 45 -30 38 -85 36 -125 -5 -50 -52 -114 -89 -154 -89 -65 0 -107 61 -155 225 -30 106 -40 124 -71 135 -30 12 -42 12 -72 0z"/>
            <path d="M1065 1535 c-23 -22 -25 -32 -25 -120 l0 -95 -95 0 c-88 0 -98 -2 -120 -25 -33 -32 -33 -78 0 -110 22 -23 32 -25 120 -25 l95 0 0 -215 c0 -216 0 -216 25 -240 32 -33 78 -33 110 0 25 24 25 24 25 240 l0 215 95 0 c88 0 98 2 120 25 16 15 25 36 25 55 0 19 -9 40 -25 55 -22 23 -32 25 -120 25 l-95 0 0 95 c0 88 -2 98 -25 120 -15 16 -36 25 -55 25 -19 0 -40 -9 -55 -25z"/>
            <path d="M3460 1622 c-55 -27 -84 -89 -84 -181 -1 -42 0 -92 1 -111 2 -19 0 -56 -3 -82 -10 -77 12 -120 99 -195 l38 -33 -51 0 c-41 0 -56 -5 -75 -25 -37 -36 -32 -74 15 -134 138 -174 374 -255 603 -206 204 43 316 203 317 451 0 91 -6 84 92 114 41 13 68 42 68 76 0 34 -41 85 -92 113 -25 14 -58 40 -72 58 -42 50 -118 83 -193 83 -74 0 -125 -19 -169 -61 -28 -27 -42 -52 -76 -139 -8 -21 -11 -23 -21 -9 -7 8 -59 70 -116 138 -133 158 -192 188 -281 143z"/>
          </g>
        </svg>
      );
    }
    if (iconClass === 'custom-signum-crucis') {
      return (
        <svg 
          className={`inline-block w-6 h-6 ${className.replace('text-2xl', '').replace('w-12 h-12', '')}`}
          viewBox="0 0 60 60" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M52.247,20.665c-0.803,0-1.544,0.257-2.154,0.687c0.041-0.223,0.069-0.452,0.069-0.687c0-2.073-1.68-3.752-3.753-3.752 c-2.073,0-3.753,1.68-3.753,3.752c0,0.114,0.017,0.224,0.027,0.335H34v-6.673c1.997-0.085,3.594-1.719,3.594-3.737 c0-2.073-1.68-3.753-3.753-3.753c-0.08,0-0.154,0.019-0.232,0.023c0.409-0.601,0.649-1.326,0.649-2.108 C34.258,2.68,32.578,1,30.505,1s-3.753,1.68-3.753,3.753c0,0.803,0.257,1.544,0.687,2.154c-0.223-0.042-0.452-0.069-0.687-0.069 C24.68,6.837,23,8.518,23,10.59c0,2.073,1.68,3.753,3.753,3.753c0.084,0,0.164-0.015,0.247-0.02V21h-9.673 c-0.085-1.997-1.719-3.594-3.737-3.594c-2.073,0-3.753,1.68-3.753,3.753c0,0.08,0.018,0.154,0.023,0.232 c-0.601-0.409-1.326-0.649-2.108-0.649C5.68,20.742,4,22.422,4,24.495s1.68,3.753,3.753,3.753c0.803,0,1.544-0.257,2.154-0.687 c-0.041,0.223-0.069,0.452-0.069,0.687c0,2.073,1.68,3.753,3.753,3.753c2.073,0,3.753-1.68,3.753-3.753 c0-0.084-0.015-0.165-0.02-0.247H27v17.682c-1.955,0.129-3.506,1.74-3.506,3.728c0,2.073,1.68,3.753,3.753,3.753 c0.08,0,0.154-0.019,0.232-0.023c-0.409,0.601-0.649,1.326-0.649,2.108c0,2.073,1.68,3.753,3.753,3.753s3.753-1.68,3.753-3.753 c0-0.803-0.257-1.544-0.687-2.154c0.223,0.041,0.452,0.069,0.687,0.069c2.073,0,3.753-1.68,3.753-3.753 c0-2.073-1.68-3.752-3.753-3.752c-0.114,0-0.223,0.017-0.335,0.027V28h8.682c0.129,1.956,1.74,3.506,3.728,3.506 c2.073,0,3.753-1.68,3.753-3.753c0-0.079-0.018-0.154-0.023-0.232c0.601,0.409,1.326,0.649,2.108,0.649 c2.073,0,3.753-1.68,3.753-3.752C56,22.345,54.32,20.665,52.247,20.665z"/>
        </svg>
      );
    }
    return <i className={`${iconClass} ${className}`} />;
  };
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSection, setCurrentSection] = useState(section);
  
  // Handle section transitions with fade animation
  useEffect(() => {
    if (section !== currentSection) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setCurrentSection(section);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [section, currentSection]);
  
  if (!content) {
    return (
      <div className="text-center">
        <p className="text-sacred-ivory/70">Seção não encontrada</p>
      </div>
    );
  }

  // Check if this is a mystery section with multiple sub-sections
  const isMysterySection = ['gaudiosa', 'dolorosa', 'gloriosa'].includes(section);
  const currentProgress = progress[section] || 0; // This represents completed count (0-5)
  // For mystery sections: show current mystery based on progress (0-based index)
  // If progress is 0, show first mystery (index 0)
  // If progress is 1, show first mystery (index 0) - it's completed
  // If progress is 2, show second mystery (index 1) - first is completed, second is current
  const currentSubSection = isMysterySection ? Math.min(currentProgress, content.sections.length - 1) : 0;

  const handleBeadClick = (index: number) => {
    // When clicking bead at index, set progress to that index (0-4)
    // This means we're now viewing mystery at that index
    onProgressUpdate(section, index);
    // Scroll to top when navigating to different mystery
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleMysteryPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleMysteryNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [section, currentProgress, isMysterySection]);

  const handleMysteryNext = () => {
    if (isMysterySection && currentProgress < 4) {
      onProgressUpdate(section, currentProgress + 1);
      // Scroll to top when advancing to next mystery
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // When moving to next section, call immediately without delay
      onNext();
      // Scroll to top when moving to next section with a small delay to ensure DOM update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleMysteryPrevious = () => {
    if (isMysterySection && currentProgress > 0) {
      onProgressUpdate(section, currentProgress - 1);
      // Scroll to top when going back to previous mystery
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // When going to previous section, call immediately without delay
      onPrevious();
      // Scroll to top when going back to previous section with a small delay to ensure DOM update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  // Add swipe gesture support for mobile navigation
  useSwipeGesture(mainContentRef, {
    onSwipeLeft: handleMysteryNext,
    onSwipeRight: handleMysteryPrevious
  }, {
    threshold: 50,
    preventDefault: false // Allow normal scrolling
  });

  return (
    <main 
      ref={mainContentRef}
      className={`animate-fade-in relative px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 main-content ${
        !isMobile ? 'ml-96' : 'mobile-container pt-2'
      }`}>
      {/* Page Title - Centered above content */}
      <div className={`text-center ${isMobile ? 'mb-6 pt-2' : 'mb-12 pt-8'}`}>
        <h1 className={`font-cinzel font-semibold text-parchment sacred-header-glow ${
          isMobile ? 'text-2xl' : 'text-4xl'
        }`}>
          <span className="text-ancient-gold sacred-cross-hover animate-cross-blessing">✠</span> Rosarium Virginis Mariae <span className="text-ancient-gold sacred-cross-hover animate-cross-blessing">✠</span>
        </h1>
      </div>
      {/* Outer container for buttons */}
      <div className="relative">
        {/* Navigation Buttons - Only show on desktop */}
        {!isMobile && (
          <>
            <div className="fixed top-1/2 transform -translate-y-1/2 z-40 left-[calc(384px+1rem)]">
              <Button
                variant="ghost"
                onClick={handleMysteryPrevious}
                className="flex items-center justify-center w-12 h-12 glass-morphism rounded-full hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 shadow-lg hover:shadow-xl sacred-interactive"
                disabled={!isMysterySection && section === 'initium'}
                title={isMysterySection && currentProgress > 0 ? 'Anterior' : 'Seção Anterior'}
              >
                <i className="fas fa-chevron-left text-byzantine-gold text-lg sacred-icon-hover" />
              </Button>
            </div>

            <div className="fixed top-1/2 transform -translate-y-1/2 z-40 right-4">
              <Button
                variant="ghost"
                onClick={handleMysteryNext}
                className="flex items-center justify-center w-12 h-12 glass-morphism rounded-full hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 shadow-lg hover:shadow-xl sacred-interactive"
                disabled={!isMysterySection && section === 'ultima'}
                title={isMysterySection && currentProgress < 4 ? 'Próximo' : 'Próxima Seção'}
              >
                <i className="fas fa-chevron-right text-byzantine-gold text-lg sacred-icon-hover" />
              </Button>
            </div>
          </>
        )}

        {/* Responsive Content Area */}
        <div className="w-full max-w-none xl:max-w-6xl 2xl:max-w-7xl mx-auto relative">

        {/* Sacred Header */}
        <div className="text-center mb-12 glass-morphism p-8 rounded-2xl sacred-border animate-fade-in-up">
          <h1 className="sacred-display text-ancient-gold mb-4 flex items-center justify-center gap-4">
            {currentSectionData?.icon && renderIcon(currentSectionData.icon, "w-12 h-12 text-ancient-gold sacred-icon-hover")}
            {content.title}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto mb-6 rounded-full"></div>
          <p className="text-parchment font-inter text-[16px]">
            {content.subtitle} <em className="font-cormorant text-ancient-gold/80">{content.latin}</em>
          </p>
          
          {/* Progress indicator for mystery sections */}
          {isMysterySection && (
            <div className="mt-6">
              <RosaryBeads 
                completed={Math.min(currentProgress + 1, 5)}
                total={5}
                size="md"
                onBeadClick={handleBeadClick}
              />
            </div>
          )}
        </div>

        {/* Prayer Content Sections */}
        <div className="space-y-8">
          {/* For mystery sections, show only the current sub-section */}
          {isMysterySection ? (
            <>
              {content.sections[currentSubSection] && (
                <>
                  {/* Mystery Offering Card */}
                  <Collapsible defaultOpen={true}>
                    <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up transition-all duration-700 ease-in-out">
                      <CardContent className="p-8">
                        <CollapsibleTrigger asChild>
                          <div className="text-center mb-8 cursor-pointer group">
                            <h2 className="font-cinzel text-2xl font-medium text-ancient-gold sacred-header-glow mb-3 flex items-center justify-center">
                              {renderIcon(content.sections[currentSubSection].icon, "mr-3 text-2xl sacred-icon-hover animate-sacred-icon-pulse")}
                              <span>{content.sections[currentSubSection].title}</span>
                              <ChevronDown className="w-5 h-5 ml-3 text-ancient-gold transition-transform duration-200 group-data-[state=closed]:rotate-180" />
                            </h2>
                            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full"></div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          {/* Language selector for mobile */}
                          <LanguageSelector prayerKey={`mystery-section-${section}-${currentSubSection}`} />
                          
                          <div className="prayer-grid">
                            {/* Show both columns on desktop, single column on mobile based on selection */}
                            {(!isMobile || getSelectedLanguage(`mystery-section-${section}-${currentSubSection}`) === 'latin') && (
                              <div className={`prayer-column ${isMobile ? 'col-span-2' : ''}`}>
                                <div className="prayer-content">
                                  <div 
                                    className={`prayer-latin ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                                    dangerouslySetInnerHTML={{ __html: (content.sections[currentSubSection] as any).offering?.latin || (content.sections[currentSubSection] as any).latin }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Show both columns on desktop, single column on mobile based on selection */}
                            {(!isMobile || getSelectedLanguage(`mystery-section-${section}-${currentSubSection}`) === 'portuguese') && (
                              <div className={`prayer-column ${isMobile ? 'col-span-2' : ''}`}>
                                <div className="prayer-content">
                                  <div 
                                    className={`prayer-portuguese ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                                    dangerouslySetInnerHTML={{ __html: (content.sections[currentSubSection] as any).offering?.portuguese || (content.sections[currentSubSection] as any).portuguese }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </CardContent>
                    </Card>
                  </Collapsible>

                  {/* Individual Prayer Cards for mystery sections */}
                  {isMysterySection && (content.sections[currentSubSection] as any).prayers && (content.sections[currentSubSection] as any).prayers.map((prayer: any, prayerIndex: number) => (
                    <Collapsible key={prayerIndex} defaultOpen={true}>
                      <Card className="sacred-content-card rounded-2xl sacred-border animate-fade-in-up transition-all duration-700 ease-in-out">
                        <CardContent className="p-8">
                          <CollapsibleTrigger asChild>
                            <div className="text-center mb-8 cursor-pointer group">
                              <h2 className="font-cinzel text-2xl font-medium text-ancient-gold sacred-header-glow mb-3 flex items-center justify-center">
                                {renderIcon(prayer.icon, "mr-3 text-2xl sacred-icon-hover animate-sacred-icon-pulse")}
                                <span>{prayer.title}</span>
                                <ChevronDown className="w-5 h-5 ml-3 text-ancient-gold transition-transform duration-200 group-data-[state=closed]:rotate-180" />
                              </h2>
                              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full"></div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            {/* Language selector for mobile */}
                            <LanguageSelector prayerKey={`mystery-prayer-${section}-${currentSubSection}-${prayerIndex}`} />
                            
                            <div className="prayer-grid">
                              {/* Show both columns on desktop, single column on mobile based on selection */}
                              {(!isMobile || getSelectedLanguage(`mystery-prayer-${section}-${currentSubSection}-${prayerIndex}`) === 'latin') && (
                                <div className={`prayer-column ${isMobile ? 'col-span-2' : ''}`}>
                                  <div className="prayer-content">
                                    <div 
                                      className={`prayer-latin ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                                      dangerouslySetInnerHTML={{ __html: prayer.latin }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Show both columns on desktop, single column on mobile based on selection */}
                              {(!isMobile || getSelectedLanguage(`mystery-prayer-${section}-${currentSubSection}-${prayerIndex}`) === 'portuguese') && (
                                <div className={`prayer-column ${isMobile ? 'col-span-2' : ''}`}>
                                  <div className="prayer-content">
                                    <div 
                                      className={`prayer-portuguese ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                                      dangerouslySetInnerHTML={{ __html: prayer.portuguese }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </CardContent>
                      </Card>
                    </Collapsible>
                  ))}
                </>
              )}
            </>
          ) : (
            /* For non-mystery sections, show all sections */
            (<>
              {content.sections.filter(shouldShowPrayer).map((prayerSection: any, index: number) => (
                <div key={index}>
                  {/* Insert custom prayers before Credo in Initium section */}
                  {section === 'initium' && prayerSection.title === 'Credo' && getCustomPrayersForSection('initium').length > 0 && (
                    <div className="space-y-8 mb-8">
                      {getCustomPrayersForSection('initium').map(prayer => renderCustomPrayerCard(prayer))}
                    </div>
                  )}
                  
                  {/* Show Angelus/Regina Coeli selector before the selected prayer in Ultima section */}
                  {section === 'ultima' && (prayerSection.title === 'Angelus' || prayerSection.title === 'Regina Coeli') && (
                    <AngelusReginaSelector />
                  )}
                  
                  <Collapsible defaultOpen={true}>
                    <Card className="sacred-content-card rounded-2xl sacred-border">
                      <CardContent className="p-8">
                        <CollapsibleTrigger asChild>
                          <div className="text-center mb-8 cursor-pointer group">
                            <h2 className="font-cinzel text-2xl font-medium text-ancient-gold sacred-header-glow mb-3 flex items-center justify-center">
                              {renderIcon(prayerSection.icon, "mr-3 text-2xl sacred-icon-hover animate-sacred-icon-pulse")}
                              <span>{prayerSection.title}</span>
                              <ChevronDown className="w-5 h-5 ml-3 text-ancient-gold transition-transform duration-200 group-data-[state=closed]:rotate-180" />
                            </h2>
                            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full"></div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          {/* Language selector for mobile */}
                          <LanguageSelector prayerKey={`section-prayer-${section}-${index}`} />
                          
                          <div className="prayer-grid">
                            {/* Show both columns on desktop, single column on mobile based on selection */}
                            {(!isMobile || getSelectedLanguage(`section-prayer-${section}-${index}`) === 'latin') && (
                              <div className={`prayer-column ${isMobile ? 'col-span-2' : ''}`}>
                                <div className="prayer-content">
                                  <div 
                                    className={`prayer-latin ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                                    dangerouslySetInnerHTML={{ __html: (prayerSection as any).latin }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Show both columns on desktop, single column on mobile based on selection */}
                            {(!isMobile || getSelectedLanguage(`section-prayer-${section}-${index}`) === 'portuguese') && (
                              <div className={`prayer-column ${isMobile ? 'col-span-2' : ''}`}>
                                <div className="prayer-content">
                                  <div 
                                    className={`prayer-portuguese ${getFontSizeClass()} ${getLineHeightClass()} ${getLetterSpacingClass()}`}
                                    dangerouslySetInnerHTML={{ __html: (prayerSection as any).portuguese }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </CardContent>
                    </Card>
                  </Collapsible>
                  
                  {/* Show Personal Intentions after Offertorium Rosarii */}
                  {prayerSection.title === "Offertorium Rosarii" && intentions.length > 0 && (
                    <Collapsible defaultOpen={true}>
                      <Card className="sacred-content-card rounded-2xl sacred-border mt-6">
                        <CardContent className="p-8">
                          <CollapsibleTrigger asChild>
                            <div className="text-center mb-6 cursor-pointer group">
                              <h3 className="font-cinzel text-xl font-medium text-ancient-gold sacred-header-glow flex items-center justify-center">
                                <svg 
                                  className="w-5 h-5 flex-shrink-0 text-ancient-gold mr-3" 
                                  viewBox="0 0 25.708 25.708" 
                                  fill="currentColor" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <ellipse cx="12.855" cy="5.772" rx="1.804" ry="0.451"/>
                                  <path d="M13.618,4.488c0.1-0.208,0.18-0.449,0.22-0.737C13.955,2.89,13.648,1.854,12.842,0c-0.299,2.183-0.993,2.402-0.993,3.751
                                    c0,0.296,0.075,0.537,0.179,0.746C10.773,4.64,9.85,5.099,9.85,5.647v9.526c0.196,0.261,0.314,0.563,0.314,0.916v8.416
                                    c0,0.166-0.034,0.32-0.081,0.465c0.456,0.433,1.524,0.737,2.771,0.737c1.247,0,2.316-0.305,2.771-0.737
                                    c-0.047-0.147-0.079-0.299-0.079-0.465v-8.416c0-0.353,0.118-0.655,0.313-0.916V5.647C15.86,5.088,14.906,4.624,13.618,4.488z
                                     M12.855,6.501c-1.72,0-2.658-0.564-2.658-0.854c0-0.255,0.721-0.721,2.058-0.832c0.167,0.16,0.364,0.268,0.587,0.268
                                    c0.225,0,0.404-0.109,0.557-0.27c1.37,0.103,2.113,0.575,2.113,0.833C15.514,5.937,14.575,6.501,12.855,6.501z"/>
                                  <path d="M6.972,14.931c0.101-0.208,0.181-0.449,0.221-0.737c0.116-0.861-0.191-1.897-0.995-3.751
                                    c-0.3,2.184-0.995,2.401-0.995,3.751c0,0.296,0.077,0.536,0.18,0.746c-1.255,0.143-2.179,0.602-2.179,1.149v8.416
                                    c0,0.664,1.346,1.202,3.006,1.202c1.659,0,3.005-0.538,3.005-1.202v-8.416C9.214,15.532,8.26,15.067,6.972,14.931z M6.21,16.945
                                    c-1.72,0-2.66-0.564-2.66-0.854c0-0.257,0.722-0.722,2.06-0.832c0.167,0.159,0.364,0.269,0.588,0.269
                                    c0.224,0,0.403-0.11,0.557-0.271c1.371,0.104,2.114,0.575,2.114,0.834C8.868,16.38,7.93,16.945,6.21,16.945z"/>
                                  <ellipse cx="6.21" cy="16.214" rx="1.804" ry="0.451"/>
                                  <path d="M20.262,14.931c0.1-0.208,0.182-0.449,0.22-0.737c0.117-0.861-0.19-1.897-0.995-3.751
                                    c-0.299,2.184-0.994,2.401-0.994,3.751c0,0.296,0.076,0.536,0.179,0.746c-1.255,0.143-2.179,0.602-2.179,1.149v8.416
                                    c0,0.664,1.347,1.202,3.005,1.202c1.661,0,3.007-0.538,3.007-1.202v-8.416C22.506,15.532,21.551,15.067,20.262,14.931z
                                     M19.5,16.945c-1.72,0-2.657-0.564-2.657-0.854c0-0.257,0.722-0.722,2.058-0.832c0.166,0.159,0.363,0.269,0.589,0.269
                                    c0.225,0,0.403-0.11,0.556-0.271c1.369,0.104,2.115,0.575,2.115,0.834C22.16,16.38,21.22,16.945,19.5,16.945z"/>
                                  <ellipse cx="19.5" cy="16.214" rx="1.804" ry="0.451"/>
                                </svg>
                                <span>Intentiones Personales</span>
                                <ChevronDown className="w-5 h-5 ml-3 text-ancient-gold transition-transform duration-200 group-data-[state=closed]:rotate-180" />
                              </h3>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="bg-[var(--cathedral-shadow)]/40 p-6 rounded-xl border border-[var(--ancient-gold-alpha)]">
                              {intentions.map((intention) => (
                                <p key={intention.id} className="text-parchment font-crimson text-base mb-3 last:mb-0 flex items-start">
                                  <svg 
                                    className="w-4 h-4 flex-shrink-0 text-ancient-gold mr-3 mt-0.5" 
                                    viewBox="0 0 25.708 25.708" 
                                    fill="currentColor" 
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <ellipse cx="12.855" cy="5.772" rx="1.804" ry="0.451"/>
                                    <path d="M13.618,4.488c0.1-0.208,0.18-0.449,0.22-0.737C13.955,2.89,13.648,1.854,12.842,0c-0.299,2.183-0.993,2.402-0.993,3.751
                                      c0,0.296,0.075,0.537,0.179,0.746C10.773,4.64,9.85,5.099,9.85,5.647v9.526c0.196,0.261,0.314,0.563,0.314,0.916v8.416
                                      c0,0.166-0.034,0.32-0.081,0.465c0.456,0.433,1.524,0.737,2.771,0.737c1.247,0,2.316-0.305,2.771-0.737
                                      c-0.047-0.147-0.079-0.299-0.079-0.465v-8.416c0-0.353,0.118-0.655,0.313-0.916V5.647C15.86,5.088,14.906,4.624,13.618,4.488z
                                       M12.855,6.501c-1.72,0-2.658-0.564-2.658-0.854c0-0.255,0.721-0.721,2.058-0.832c0.167,0.16,0.364,0.268,0.587,0.268
                                      c0.225,0,0.404-0.109,0.557-0.27c1.37,0.103,2.113,0.575,2.113,0.833C15.514,5.937,14.575,6.501,12.855,6.501z"/>
                                    <path d="M6.972,14.931c0.101-0.208,0.181-0.449,0.221-0.737c0.116-0.861-0.191-1.897-0.995-3.751
                                      c-0.3,2.184-0.995,2.401-0.995,3.751c0,0.296,0.077,0.536,0.18,0.746c-1.255,0.143-2.179,0.602-2.179,1.149v8.416
                                      c0,0.664,1.346,1.202,3.006,1.202c1.659,0,3.005-0.538,3.005-1.202v-8.416C9.214,15.532,8.26,15.067,6.972,14.931z M6.21,16.945
                                      c-1.72,0-2.66-0.564-2.66-0.854c0-0.257,0.722-0.722,2.06-0.832c0.167,0.159,0.364,0.269,0.588,0.269
                                      c0.224,0,0.403-0.11,0.557-0.271c1.371,0.104,2.114,0.575,2.114,0.834C8.868,16.38,7.93,16.945,6.21,16.945z"/>
                                    <ellipse cx="6.21" cy="16.214" rx="1.804" ry="0.451"/>
                                    <path d="M20.262,14.931c0.1-0.208,0.182-0.449,0.22-0.737c0.117-0.861-0.19-1.897-0.995-3.751
                                      c-0.299,2.184-0.994,2.401-0.994,3.751c0,0.296,0.076,0.536,0.179,0.746c-1.255,0.143-2.179,0.602-2.179,1.149v8.416
                                      c0,0.664,1.347,1.202,3.005,1.202c1.661,0,3.007-0.538,3.007-1.202v-8.416C22.506,15.532,21.551,15.067,20.262,14.931z
                                       M19.5,16.945c-1.72,0-2.657-0.564-2.657-0.854c0-0.257,0.722-0.722,2.058-0.832c0.166,0.159,0.363,0.269,0.589,0.269
                                      c0.225,0,0.403-0.11,0.556-0.271c1.369,0.104,2.115,0.575,2.115,0.834C22.16,16.38,21.22,16.945,19.5,16.945z"/>
                                    <ellipse cx="19.5" cy="16.214" rx="1.804" ry="0.451"/>
                                  </svg>
                                  <span>{intention.text}</span>
                                </p>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </CardContent>
                      </Card>
                    </Collapsible>
                  )}
                </div>
              ))}
              
              {/* Insert custom prayers after Signum Crucis in Ultima section */}
              {section === 'ultima' && getCustomPrayersForSection('ultima').length > 0 && (
                <div className="space-y-8 mt-8">
                  {getCustomPrayersForSection('ultima').map(prayer => renderCustomPrayerCard(prayer))}
                </div>
              )}
            </>)
          )}


        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-[var(--byzantine-gold-alpha)]">
        </div>

        {/* Mobile Mystery Navigation - Only show for mystery sections on mobile */}
        {isMobile && isMysterySection && (
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              variant="ghost"
              onClick={handleMysteryPrevious}
              className="flex items-center justify-center w-12 h-12 glass-morphism rounded-full hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 shadow-lg hover:shadow-xl sacred-interactive"
              disabled={currentProgress === 0}
              title="Mistério Anterior"
            >
              <i className="fas fa-chevron-left text-byzantine-gold text-lg sacred-icon-hover" />
            </Button>

            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleBeadClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentProgress 
                      ? 'bg-[var(--ancient-gold-bright)]' 
                      : index === currentProgress
                      ? 'bg-[var(--byzantine-gold)] ring-2 ring-[var(--byzantine-gold)]/50'
                      : 'bg-[var(--cathedral-stone-light)]/30 hover:bg-[var(--byzantine-gold)]/50'
                  }`}
                  title={`Mistério ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={handleMysteryNext}
              className="flex items-center justify-center w-12 h-12 glass-morphism rounded-full hover:bg-[var(--byzantine-gold-alpha)] transition-all duration-300 shadow-lg hover:shadow-xl sacred-interactive"
              disabled={currentProgress >= 4}
              title="Próximo Mistério"
            >
              <i className="fas fa-chevron-right text-byzantine-gold text-lg sacred-icon-hover" />
            </Button>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
