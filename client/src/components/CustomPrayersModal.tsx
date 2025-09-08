import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCustomPrayers } from "@/hooks/useCustomPrayers";
import { useAuth } from "@/hooks/useAuth";

interface CustomPrayersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomPrayersModal({ isOpen, onClose }: CustomPrayersModalProps) {
  const { user } = useAuth();
  const { customPrayers, addCustomPrayer, updateCustomPrayer, removeCustomPrayer, isAddingCustomPrayer, isUpdatingCustomPrayer, isRemovingCustomPrayer } = useCustomPrayers(user?.id || null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newPrayerData, setNewPrayerData] = useState({
    title: "",
    content: "",
    section: ""
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea function
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 300; // Maximum height in pixels
      
      if (scrollHeight <= maxHeight) {
        // Content fits within max height - expand textarea and hide overflow
        textarea.style.height = scrollHeight + 'px';
        textarea.style.overflowY = 'hidden';
      } else {
        // Content exceeds max height - set to max height and enable scrolling
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflowY = 'auto';
      }
    }
  };

  // Adjust textarea height when content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [newPrayerData.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPrayerData.title.trim() || !newPrayerData.content.trim() || !newPrayerData.section) {
      return;
    }

    if (isEditing && editingId) {
      await updateCustomPrayer({
        id: editingId,
        title: newPrayerData.title,
        content: newPrayerData.content,
        section: newPrayerData.section
      });
      setIsEditing(false);
      setEditingId(null);
    } else {
      await addCustomPrayer(newPrayerData);
    }

    setNewPrayerData({ title: "", content: "", section: "" });
    // Reset textarea height
    setTimeout(adjustTextareaHeight, 0);
  };

  const handleEdit = (prayer: { id: number; title: string; content: string; section: string }) => {
    setIsEditing(true);
    setEditingId(prayer.id);
    setNewPrayerData({
      title: prayer.title,
      content: prayer.content,
      section: prayer.section
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setNewPrayerData({ title: "", content: "", section: "" });
    // Reset textarea height
    setTimeout(adjustTextareaHeight, 0);
  };

  const handleRemove = async (id: number) => {
    await removeCustomPrayer(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sacred-modal !max-w-none !w-full">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-ancient-gold sacred-header-glow text-center">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-ancient-gold mr-2 sm:mr-3 md:mr-4 inline-block" 
              viewBox="0 0 60 60" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M52.247,20.665c-0.803,0-1.544,0.257-2.154,0.687c0.041-0.223,0.069-0.452,0.069-0.687c0-2.073-1.68-3.752-3.753-3.752 c-2.073,0-3.753,1.68-3.753,3.752c0,0.114,0.017,0.224,0.027,0.335H34v-6.673c1.997-0.085,3.594-1.719,3.594-3.737 c0-2.073-1.68-3.753-3.753-3.753c-0.08,0-0.154,0.019-0.232,0.023c0.409-0.601,0.649-1.326,0.649-2.108 C34.258,2.68,32.578,1,30.505,1s-3.753,1.68-3.753,3.753c0,0.803,0.257,1.544,0.687,2.154c-0.223-0.042-0.452-0.069-0.687-0.069 C24.68,6.837,23,8.518,23,10.59c0,2.073,1.68,3.753,3.753,3.753c0.084,0,0.164-0.015,0.247-0.02V21h-9.673 c-0.085-1.997-1.719-3.594-3.737-3.594c-2.073,0-3.753,1.68-3.753,3.753c0,0.08,0.018,0.154,0.023,0.232 c-0.601-0.409-1.326-0.649-2.108-0.649C5.68,20.742,4,22.422,4,24.495s1.68,3.753,3.753,3.753c0.803,0,1.544-0.257,2.154-0.687 c-0.041,0.223-0.069,0.452-0.069,0.687c0,2.073,1.68,3.753,3.753,3.753c2.073,0,3.753-1.68,3.753-3.753 c0-0.084-0.015-0.165-0.02-0.247H27v17.682c-1.955,0.129-3.506,1.74-3.506,3.728c0,2.073,1.68,3.753,3.753,3.753 c0.08,0,0.154-0.019,0.232-0.023c-0.409,0.601-0.649,1.326-0.649,2.108c0,2.073,1.68,3.753,3.753,3.753s3.753-1.68,3.753-3.753 c0-0.803-0.257-1.544-0.687-2.154c0.223,0.041,0.452,0.069,0.687,0.069c2.073,0,3.753-1.68,3.753-3.753 c0-2.073-1.68-3.752-3.753-3.752c-0.114,0-0.223,0.017-0.335,0.027V28h8.682c0.129,1.956,1.74,3.506,3.728,3.506 c2.073,0,3.753-1.68,3.753-3.753c0-0.079-0.018-0.154-0.023-0.232c0.601,0.409,1.326,0.649,2.108,0.649 c2.073,0,3.753-1.68,3.753-3.752C56,22.345,54.32,20.665,52.247,20.665z"/>
            </svg>
            Adicionar Oração
          </DialogTitle>
          <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full mt-4 sm:mt-6"></div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8 w-full overflow-hidden">
          {/* Add/Edit Prayer Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6 w-full">
            <div>
              <Label htmlFor="prayer-title" className="text-byzantine-gold font-inter text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 block">
                <i className="fas fa-cross mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                Título da Oração
              </Label>
              <Input
                id="prayer-title"
                value={newPrayerData.title}
                onChange={(e) => setNewPrayerData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título da oração"
                className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-10 sm:h-12 md:h-14 font-crimson text-sm sm:text-base md:text-lg"
                required
              />
            </div>

            <div>
              <Label htmlFor="prayer-content" className="text-byzantine-gold font-inter text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 block">
                <i className="fas fa-scroll mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                Conteúdo da Oração
              </Label>
              <Textarea
                ref={textareaRef}
                id="prayer-content"
                value={newPrayerData.content}
                onChange={(e) => {
                  setNewPrayerData(prev => ({ ...prev, content: e.target.value }));
                  // Delay adjustment to allow state update
                  setTimeout(adjustTextareaHeight, 0);
                }}
                placeholder="Digite o conteúdo da oração"
                className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment placeholder-parchment/60 focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg font-crimson min-h-[100px] sm:min-h-[120px] md:min-h-[150px] w-full resize-none sacred-scroll text-sm sm:text-base md:text-lg leading-relaxed"
                style={{ 
                  wordWrap: 'break-word', 
                  overflowWrap: 'break-word',
                  maxHeight: '300px'
                }}
                required
              />
            </div>

            <div>
              <Label className="text-byzantine-gold font-inter text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 block">
                <i className="fas fa-map-marker-alt mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                Seção
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant={newPrayerData.section === 'initium' ? 'default' : 'outline'}
                  onClick={() => setNewPrayerData(prev => ({ ...prev, section: 'initium' }))}
                  className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-crimson transition-all duration-200 ${
                    newPrayerData.section === 'initium' 
                      ? 'bg-[var(--ancient-gold)] text-[var(--cathedral-void)] border-[var(--ancient-gold)] hover:bg-[var(--ancient-gold-bright)] hover:border-[var(--ancient-gold-bright)]' 
                      : 'bg-[var(--gothic-stone)] text-parchment border-[var(--ancient-gold-alpha)] hover:bg-[var(--ancient-gold-alpha)] hover:border-[var(--ancient-gold)] hover:text-[var(--ancient-gold)]'
                  }`}
                >
                  <svg 
                    className="w-4 h-4 mr-2 text-xs sm:text-sm md:text-base flex-shrink-0" 
                    viewBox="0 0 512 512" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="translate(0,512) scale(0.1,-0.1)">
                      <path d="M2369 4781 c-24 -19 -24 -23 -27 -220 l-3 -201 -255 0 c-241 0 -255 -1 -274 -20 -19 -19 -20 -33 -20 -199 l0 -180 26 -20 c25 -20 39 -21 275 -21 l249 0 2 -726 3 -726 24 -19 c21 -17 41 -19 196 -19 l174 0 20 26 c21 26 21 33 21 745 l0 719 249 0 c250 0 250 0 278 24 28 24 28 25 31 166 4 161 -1 203 -29 231 -18 18 -35 19 -274 19 l-255 0 0 194 c0 180 -1 195 -21 220 l-20 26 -174 0 c-155 0 -175 -2 -196 -19z m261 -325 c0 -176 2 -196 19 -217 19 -24 20 -24 280 -27 l261 -3 0 -69 0 -70 -259 0 -260 0 -20 -26 c-21 -26 -21 -33 -21 -745 l0 -719 -70 0 -70 0 0 723 0 724 -23 21 c-22 21 -32 22 -277 24 l-255 3 -3 67 -3 67 261 3 c261 3 262 3 281 27 17 21 19 41 19 217 l0 194 70 0 70 0 0 -194z"/>
                      <path d="M1775 2346 c-108 -21 -186 -51 -360 -136 -251 -123 -412 -180 -564 -199 -50 -6 -80 -16 -93 -28 -12 -13 -28 -63 -46 -146 l-27 -127 -91 0 c-73 0 -96 -4 -113 -18 -19 -15 -41 -106 -156 -642 -74 -344 -135 -640 -135 -658 0 -46 30 -72 82 -72 24 0 205 9 403 20 198 11 446 24 550 30 105 6 307 17 450 25 143 8 409 22 590 31 l330 16 1111 -61 c612 -33 1128 -61 1148 -61 46 0 76 29 76 72 0 18 -61 314 -135 658 -115 536 -137 627 -156 642 -17 14 -40 18 -113 18 l-91 0 -27 127 c-18 83 -34 133 -46 146 -13 12 -43 22 -93 28 -152 19 -313 76 -564 199 -181 89 -277 123 -396 141 -222 32 -470 -41 -668 -197 l-81 -64 -83 65 c-97 77 -234 147 -344 176 -101 26 -265 33 -358 15z m287 -151 c136 -28 258 -92 364 -188 l64 -59 0 -389 c0 -214 -4 -389 -9 -389 -4 0 -41 15 -82 34 -150 69 -324 103 -461 92 -145 -12 -251 -44 -500 -150 -166 -71 -320 -116 -482 -141 -120 -19 -276 -33 -276 -25 0 8 180 843 186 862 3 10 17 21 32 24 207 44 329 89 600 218 156 75 235 104 322 119 56 10 179 6 242 -8z m1323 -10 c33 -9 140 -55 237 -101 271 -130 393 -174 600 -218 15 -3 29 -14 32 -24 5 -16 186 -852 186 -859 0 -8 -103 -2 -200 12 -236 33 -370 71 -590 165 -176 75 -274 107 -385 127 -164 28 -349 2 -519 -73 -45 -19 -87 -38 -93 -41 -10 -4 -13 78 -13 390 l0 395 59 54 c100 90 223 154 355 184 76 17 247 12 331 -11z m-2735 -629 c0 -2 -31 -149 -69 -327 -83 -387 -113 -549 -109 -591 2 -20 13 -38 30 -51 27 -20 33 -20 185 -9 344 25 548 72 839 192 252 105 317 122 464 124 161 1 273 -32 459 -135 49 -27 99 -49 110 -49 10 0 71 27 134 60 321 169 503 170 882 8 300 -129 489 -174 846 -200 165 -11 170 -11 197 9 17 13 28 31 30 51 4 42 -26 206 -108 590 -39 177 -70 325 -70 327 0 3 15 5 33 5 l32 0 113 -533 c62 -292 113 -538 112 -545 0 -9 -16 -11 -62 -7 -35 3 -187 12 -338 20 -151 8 -302 21 -335 29 -102 25 -234 75 -385 148 -193 92 -283 119 -432 125 -217 10 -422 -45 -609 -163 l-37 -23 -79 45 c-104 59 -217 102 -333 126 -77 16 -120 19 -225 15 -162 -6 -244 -29 -445 -125 -151 -73 -283 -123 -385 -148 -33 -8 -179 -21 -325 -29 -146 -8 -298 -17 -337 -19 -54 -4 -73 -3 -73 7 -1 6 50 252 112 544 l113 533 33 0 c17 0 32 -2 32 -4z m1483 -420 c94 -18 216 -66 315 -124 100 -58 124 -58 224 0 168 98 339 145 493 135 117 -8 229 -41 445 -132 189 -79 267 -105 411 -135 115 -24 313 -50 378 -50 26 0 54 -6 63 -12 16 -13 34 -98 21 -98 -5 0 -71 7 -148 15 -285 30 -426 66 -694 177 -289 119 -437 150 -614 128 -117 -14 -229 -50 -359 -115 l-108 -54 -107 54 c-201 99 -370 135 -546 116 -125 -14 -230 -46 -428 -129 -273 -116 -442 -156 -782 -187 l-67 -6 6 43 c8 54 26 68 85 68 67 0 265 27 379 51 138 30 263 72 448 150 143 61 258 98 342 112 57 10 173 6 243 -7z m-81 -486 c86 -10 255 -56 244 -67 -5 -6 -612 -42 -696 -42 l-45 0 55 29 c70 36 177 68 261 79 90 12 85 12 181 1z m1298 -21 c41 -11 107 -35 145 -53 l70 -34 -45 -1 c-77 -1 -691 36 -696 42 -10 10 157 58 230 66 91 11 201 4 296 -20z"/>
                    </g>
                  </svg>
                  Prima Oratio
                </Button>
                <Button
                  type="button"
                  variant={newPrayerData.section === 'ultima' ? 'default' : 'outline'}
                  onClick={() => setNewPrayerData(prev => ({ ...prev, section: 'ultima' }))}
                  className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-crimson transition-all duration-200 ${
                    newPrayerData.section === 'ultima' 
                      ? 'bg-[var(--ancient-gold)] text-[var(--cathedral-void)] border-[var(--ancient-gold)] hover:bg-[var(--ancient-gold-bright)] hover:border-[var(--ancient-gold-bright)]' 
                      : 'bg-[var(--gothic-stone)] text-parchment border-[var(--ancient-gold-alpha)] hover:bg-[var(--ancient-gold-alpha)] hover:border-[var(--ancient-gold)] hover:text-[var(--ancient-gold)]'
                  }`}
                >
                  <svg 
                    className="w-4 h-4 mr-2 text-xs sm:text-sm md:text-base flex-shrink-0" 
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
                  Ultima Oratio
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                type="submit" 
                className="sacred-button flex-1 h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-bold"
                disabled={isAddingCustomPrayer || isUpdatingCustomPrayer}
              >
                {isEditing ? (
                  <>
                    <i className="fas fa-save mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                    {isUpdatingCustomPrayer ? "Atualizando..." : "Atualizar Oração"}
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                    {isAddingCustomPrayer ? "Adicionando..." : "Adicionar Oração"}
                  </>
                )}
              </Button>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="sacred-button-secondary h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg px-4 sm:px-6"
                >
                  <i className="fas fa-times mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          {/* Current Custom Prayers */}
          <div>
            <h3 className="text-sacred-ivory font-inter text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4">
              Orações Personalizadas{" "}
              <span className="text-byzantine-gold">({customPrayers.length})</span>
            </h3>
            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 md:max-h-72 overflow-y-auto sacred-scroll">
              {customPrayers.length === 0 ? (
                <p className="text-sacred-ivory/60 text-sm sm:text-base md:text-lg text-center py-4 sm:py-6">
                  Nenhuma oração personalizada adicionada ainda
                </p>
              ) : (
                customPrayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="flex items-start justify-between p-3 sm:p-4 md:p-5 bg-[var(--cathedral-shadow)]/30 rounded-lg border border-[var(--ancient-gold-alpha)] hover:border-[var(--ancient-gold-glow)] transition-all duration-300 w-full"
                  >
                    <div className="flex-1 min-w-0 pr-2 sm:pr-3 overflow-hidden">
                      <h4 className="text-parchment text-sm sm:text-base md:text-lg font-crimson font-medium mb-1 sm:mb-2 break-words flex items-center">
                        <svg 
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-ancient-gold mr-2 sm:mr-3 flex-shrink-0" 
                          viewBox="0 0 60 60" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M52.247,20.665c-0.803,0-1.544,0.257-2.154,0.687c0.041-0.223,0.069-0.452,0.069-0.687c0-2.073-1.68-3.752-3.753-3.752 c-2.073,0-3.753,1.68-3.753,3.752c0,0.114,0.017,0.224,0.027,0.335H34v-6.673c1.997-0.085,3.594-1.719,3.594-3.737 c0-2.073-1.68-3.753-3.753-3.753c-0.08,0-0.154,0.019-0.232,0.023c0.409-0.601,0.649-1.326,0.649-2.108 C34.258,2.68,32.578,1,30.505,1s-3.753,1.68-3.753,3.753c0,0.803,0.257,1.544,0.687,2.154c-0.223-0.042-0.452-0.069-0.687-0.069 C24.68,6.837,23,8.518,23,10.59c0,2.073,1.68,3.753,3.753,3.753c0.084,0,0.164-0.015,0.247-0.02V21h-9.673 c-0.085-1.997-1.719-3.594-3.737-3.594c-2.073,0-3.753,1.68-3.753,3.753c0,0.08,0.018,0.154,0.023,0.232 c-0.601-0.409-1.326-0.649-2.108-0.649C5.68,20.742,4,22.422,4,24.495s1.68,3.753,3.753,3.753c0.803,0,1.544-0.257,2.154-0.687 c-0.041,0.223-0.069,0.452-0.069,0.687c0,2.073,1.68,3.753,3.753,3.753c2.073,0,3.753-1.68,3.753-3.753 c0-0.084-0.015-0.165-0.02-0.247H27v17.682c-1.955,0.129-3.506,1.74-3.506,3.728c0,2.073,1.68,3.753,3.753,3.753 c0.08,0,0.154-0.019,0.232-0.023c-0.409,0.601-0.649,1.326-0.649,2.108c0,2.073,1.68,3.753,3.753,3.753s3.753-1.68,3.753-3.753 c0-0.803-0.257-1.544-0.687-2.154c0.223,0.041,0.452,0.069,0.687,0.069c2.073,0,3.753-1.68,3.753-3.753 c0-2.073-1.68-3.752-3.753-3.752c-0.114,0-0.223,0.017-0.335,0.027V28h8.682c0.129,1.956,1.74,3.506,3.728,3.506 c2.073,0,3.753-1.68,3.753-3.753c0-0.079-0.018-0.154-0.023-0.232c0.601,0.409,1.326,0.649,2.108,0.649 c2.073,0,3.753-1.68,3.753-3.752C56,22.345,54.32,20.665,52.247,20.665z"/>
                        </svg>
                        {prayer.title}
                      </h4>
                      <p className="text-parchment/70 text-xs sm:text-sm md:text-base font-crimson mb-1 sm:mb-2 break-words overflow-hidden leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {prayer.content}
                      </p>
                      <p className="text-byzantine-gold text-xs sm:text-sm md:text-base font-inter">
                        {prayer.section === 'initium' ? 'Prima Oratio' : 'Ultima Oratio'}
                      </p>
                    </div>
                    <div className="flex gap-1 sm:gap-2 ml-2 sm:ml-3 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(prayer)}
                        className="text-parchment/50 hover:text-byzantine-gold hover:bg-byzantine-gold/10 rounded-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1 sm:p-2"
                        disabled={isUpdatingCustomPrayer}
                      >
                        <i className="fas fa-edit text-xs sm:text-sm md:text-base" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(prayer.id)}
                        className="text-parchment/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 p-1 sm:p-2"
                        disabled={isRemovingCustomPrayer}
                      >
                        <i className="fas fa-trash text-xs sm:text-sm md:text-base" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}