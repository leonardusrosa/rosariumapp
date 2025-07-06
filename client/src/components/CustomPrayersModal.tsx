import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <DialogContent className="sacred-modal">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-cinzel text-ancient-gold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 md:gap-4">
            <svg 
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-byzantine-gold" 
              viewBox="0 0 60 60" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M52.247,20.665c-0.803,0-1.544,0.257-2.154,0.687c0.041-0.223,0.069-0.452,0.069-0.687c0-2.073-1.68-3.752-3.753-3.752 c-2.073,0-3.753,1.68-3.753,3.752c0,0.114,0.017,0.224,0.027,0.335H34v-6.673c1.997-0.085,3.594-1.719,3.594-3.737 c0-2.073-1.68-3.753-3.753-3.753c-0.08,0-0.154,0.019-0.232,0.023c0.409-0.601,0.649-1.326,0.649-2.108 C34.258,2.68,32.578,1,30.505,1s-3.753,1.68-3.753,3.753c0,0.803,0.257,1.544,0.687,2.154c-0.223-0.042-0.452-0.069-0.687-0.069 C24.68,6.837,23,8.518,23,10.59c0,2.073,1.68,3.753,3.753,3.753c0.084,0,0.164-0.015,0.247-0.02V21h-9.673 c-0.085-1.997-1.719-3.594-3.737-3.594c-2.073,0-3.753,1.68-3.753,3.753c0,0.08,0.018,0.154,0.023,0.232 c-0.601-0.409-1.326-0.649-2.108-0.649C5.68,20.742,4,22.422,4,24.495s1.68,3.753,3.753,3.753c0.803,0,1.544-0.257,2.154-0.687 c-0.041,0.223-0.069,0.452-0.069,0.687c0,2.073,1.68,3.753,3.753,3.753c2.073,0,3.753-1.68,3.753-3.753 c0-0.084-0.015-0.165-0.02-0.247H27v17.682c-1.955,0.129-3.506,1.74-3.506,3.728c0,2.073,1.68,3.753,3.753,3.753 c0.08,0,0.154-0.019,0.232-0.023c-0.409,0.601-0.649,1.326-0.649,2.108c0,2.073,1.68,3.753,3.753,3.753s3.753-1.68,3.753-3.753 c0-0.803-0.257-1.544-0.687-2.154c0.223,0.041,0.452,0.069,0.687,0.069c2.073,0,3.753-1.68,3.753-3.753 c0-2.073-1.68-3.752-3.753-3.752c-0.114,0-0.223,0.017-0.335,0.027V28h8.682c0.129,1.956,1.74,3.506,3.728,3.506 c2.073,0,3.753-1.68,3.753-3.753c0-0.079-0.018-0.154-0.023-0.232c0.601,0.409,1.326,0.649,2.108,0.649 c2.073,0,3.753-1.68,3.753-3.752C56,22.345,54.32,20.665,52.247,20.665z"/>
            </svg>
            Adicionar Oração
          </DialogTitle>
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
              <Label htmlFor="prayer-section" className="text-byzantine-gold font-inter text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 block">
                <i className="fas fa-map-marker-alt mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
                Seção
              </Label>
              <Select value={newPrayerData.section} onValueChange={(value) => setNewPrayerData(prev => ({ ...prev, section: value }))}>
                <SelectTrigger className="bg-[var(--gothic-stone)] border-[var(--ancient-gold-alpha)] text-parchment focus:border-[var(--byzantine-gold)] focus:ring-[var(--ancient-gold-glow)] rounded-lg h-10 sm:h-12 md:h-14 font-crimson text-sm sm:text-base md:text-lg">
                  <SelectValue placeholder="Selecione a seção" />
                </SelectTrigger>
                <SelectContent className="sacred-modal border-[var(--byzantine-gold-alpha)]">
                  <SelectItem value="initium" className="text-sm sm:text-base md:text-lg">Prima Oratio</SelectItem>
                  <SelectItem value="ultima" className="text-sm sm:text-base md:text-lg">Ultima Oratio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                type="submit" 
                className="sacred-button flex-1 h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
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
