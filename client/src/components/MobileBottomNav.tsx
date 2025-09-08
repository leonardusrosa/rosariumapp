import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onOpenIntentions: () => void;
  progress: Record<string, number>;
}

const sections = [
  {
    id: 'initium',
    title: 'Prima',
    shortTitle: 'Prima',
    icon: 'custom-initium'
  },
  {
    id: 'gaudiosa',
    title: 'Gaudiosa',
    shortTitle: 'Gaudiosa',
    icon: 'custom-gaudiosa'
  },
  {
    id: 'dolorosa',
    title: 'Dolorosa',
    shortTitle: 'Dolorosa',
    icon: 'custom-dolorosa'
  },
  {
    id: 'gloriosa',
    title: 'Gloriosa',
    shortTitle: 'Gloriosa',
    icon: 'custom-gloriosa'
  },
  {
    id: 'ultima',
    title: 'Ultima',
    shortTitle: 'Ultima',
    icon: 'custom-ultima'
  }
];

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
          <path d="M208,1020.362c-4.418,0-8,3.582-8,8v104h-56c0-4.418-3.582-8-8-8H88c-4.418,0-8,3.582-8,8H56 c-4.418,0-8,3.582-8,8v64c0,4.418,3.582,8,8,8h24v80c0,4.418,3.582,8,8,8h48c4.418,0,8-3.582,8-8v-38.377 c12.851,21.34,32.573,37.975,56,46.969v191.406c0,4.418,3.582,8,8,8h64c4.418,0,8-3.582,8-8v-191.5 c23.546-9.049,43.2-25.777,56-47.125v38.625c0,4.418,3.582,8,8,8h48c4.418,0,8-3.582,8-8v-80h24c4.418,0,8-3.582,8-8v-64 c0-4.418-3.582-8-8-8h-24c0-4.418-3.582-8-8-8h-48c-4.418,0-8,3.582-8,8h-56v-104c0-4.418-3.582-8-8-8L208,1020.362z"/>
        </g>
      </svg>
    );
  }
  if (iconClass === 'custom-gloriosa') {
    return (
      <svg 
        className={`inline-block ${className}`}
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
  return <span className={className}>✠</span>;
};

export default function MobileBottomNav({ 
  currentSection, 
  onSectionChange, 
  onOpenIntentions,
  progress 
}: MobileBottomNavProps) {
  // Determine today's mystery based on day of week
  // Monday & Thursday: Gaudiosa (Joyful)
  // Tuesday & Friday: Dolorosa (Sorrowful) 
  // Sunday, Wednesday & Saturday: Gloriosa (Glorious)
  const getTodaysMystery = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    switch (today) {
      case 1: // Monday
      case 4: // Thursday
        return 'gaudiosa';
      case 2: // Tuesday
      case 5: // Friday
        return 'dolorosa';
      case 0: // Sunday
      case 3: // Wednesday
      case 6: // Saturday
        return 'gloriosa';
      default:
        return 'gaudiosa';
    }
  };

  const todaysMystery = getTodaysMystery();
  const getProgressDots = (sectionId: string) => {
    if (!['gaudiosa', 'dolorosa', 'gloriosa'].includes(sectionId)) return null;
    
    // Show current mystery being viewed (like sidebar does) - progress + 1, but cap at 5
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-cathedral-black/95 backdrop-blur-lg border-t border-byzantine-gold/20">
      <div className="px-2 py-2">
        {/* Two-row layout for better mobile visibility */}
        <div className="space-y-1">
          {/* Top Row: Initium, Gaudiosa, Dolorosa */}
          <div className="flex items-stretch space-x-1">
            {sections.slice(0, 3).map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 px-1 h-[3.5rem] transition-all duration-300 rounded-lg",
                  currentSection === section.id
                    ? "bg-byzantine-gold/20 border border-byzantine-gold/30 text-byzantine-gold"
                    : "text-cathedral-stone-light hover:bg-byzantine-gold/10 hover:text-byzantine-gold"
                )}
                onClick={() => {
                  onSectionChange(section.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-1 relative">
                  {/* Today's Mystery Calendar Icon */}
                  {section.id === todaysMystery && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <i className="fas fa-calendar-day text-ancient-gold text-xs drop-shadow-lg" title="Mistério de Hoje" />
                    </div>
                  )}
                  <div>
                    {renderIcon(section.icon, "w-6 h-6")}
                  </div>
                  <span className="text-sm font-cinzel font-medium leading-tight text-center">
                    {section.shortTitle}
                  </span>
                  <div className="h-2 flex items-center justify-center">
                    {getProgressDots(section.id)}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {/* Bottom Row: Gloriosa, Ultima, Intenções */}
          <div className="flex items-stretch space-x-1">
            {sections.slice(3, 5).map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 px-1 h-[3.5rem] transition-all duration-300 rounded-lg",
                  currentSection === section.id
                    ? "bg-byzantine-gold/20 border border-byzantine-gold/30 text-byzantine-gold"
                    : "text-cathedral-stone-light hover:bg-byzantine-gold/10 hover:text-byzantine-gold"
                )}
                onClick={() => {
                  onSectionChange(section.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-1 relative">
                  {/* Today's Mystery Calendar Icon */}
                  {section.id === todaysMystery && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <i className="fas fa-calendar-day text-ancient-gold text-xs drop-shadow-lg" title="Mistério de Hoje" />
                    </div>
                  )}
                  <div>
                    {renderIcon(section.icon, "w-6 h-6")}
                  </div>
                  <span className="text-sm font-cinzel font-medium leading-tight text-center">
                    {section.shortTitle}
                  </span>
                  <div className="h-2 flex items-center justify-center">
                    {getProgressDots(section.id)}
                  </div>
                </div>
              </Button>
            ))}
            
            {/* Intentions Button */}
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 h-[3.5rem] text-cathedral-stone-light hover:bg-byzantine-gold/10 hover:text-byzantine-gold transition-all duration-300 rounded-lg"
              onClick={onOpenIntentions}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-1">
                <div>
                  <svg 
                    className="w-6 h-6"
                    viewBox="0 0 25.708 25.708" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse cx="12.855" cy="5.772" rx="1.804" ry="0.451"/>
                    <path d="M13.618,4.488c0.1-0.208,0.18-0.449,0.22-0.737C13.955,2.89,13.648,1.854,12.842,0c-0.299,2.183-0.993,2.402-0.993,3.751
                      c0,0.296,0.075,0.537,0.179,0.746C10.773,4.64,9.85,5.099,9.85,5.647v9.526c0.196,0.261,0.314,0.563,0.314,0.916v8.416
                      c0,0.166-0.034,0.32-0.081,0.465c0.456,0.433,1.524,0.737,2.771,0.737c1.247,0,2.316-0.305,2.771-0.737
                      c-0.046-0.146-0.079-0.299-0.079-0.465v-8.416c0-0.353,0.117-0.655,0.314-0.916V5.647C15.86,5.1,14.941,4.641,13.618,4.488z"/>
                    <path d="M5.104,1.317c-0.074,0.216-0.123,0.46-0.132,0.747c0.016,0.845,0.383,1.797,1.385,3.494
                      C6.41,3.361,6.049,3.08,6.049,1.752c0-0.285,0.017-0.526,0.048-0.729C4.419,2.06,2.845,3.307,2.845,4.825v8.913
                      c0.195,0.261,0.313,0.563,0.313,0.916v8.416c0,0.165-0.033,0.32-0.079,0.464c0.453,0.433,1.523,0.738,2.77,0.738
                      s2.316-0.306,2.771-0.738c-0.047-0.145-0.08-0.299-0.08-0.464v-8.416c0-0.353,0.118-0.655,0.314-0.916V4.825
                      c0-0.486-0.344-0.91-0.852-1.293C7.507,3.147,7.143,2.781,7.098,2.484C6.993,1.811,6.58,0.939,5.849,0
                      C5.72,1.105,5.459,1.381,5.104,1.317z"/>
                    <path d="M18.66,1.317c-0.355,0.064-0.614,0.34-0.744,1.166c-0.046,0.297-0.409,0.663-0.903,1.049
                      c-0.509,0.383-0.853,0.807-0.853,1.293v8.913c0.195,0.261,0.313,0.563,0.313,0.916v8.416c0,0.165-0.033,0.32-0.08,0.464
                      c0.455,0.433,1.524,0.738,2.771,0.738s2.316-0.306,2.771-0.738c-0.047-0.145-0.08-0.299-0.08-0.464v-8.416
                      c0-0.353,0.117-0.655,0.314-0.916V4.825c0-1.518-1.573-2.765-3.252-3.802c0.03,0.203,0.048,0.444,0.048,0.729
                      c0,1.328-0.361,1.609-0.308,3.806c1.002-1.697,1.369-2.649,1.385-3.494C19.851,1.317,19.799,1.105,19.66,1.317z"/>
                  </svg>
                </div>
                <span className="text-sm font-cinzel font-medium leading-tight text-center">
                  Intenções
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}