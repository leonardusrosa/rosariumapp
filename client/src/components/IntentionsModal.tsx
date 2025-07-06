import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IntentionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intentions: Array<{ id: number; text: string }>;
  onAddIntention: (text: string) => void;
  onRemoveIntention: (id: number) => void;
  onSave: () => void;
}

export default function IntentionsModal({
  open,
  onOpenChange,
  intentions,
  onAddIntention,
  onRemoveIntention,
  onSave
}: IntentionsModalProps) {
  const [newIntention, setNewIntention] = useState("");

  const handleAddIntention = () => {
    if (newIntention.trim()) {
      onAddIntention(newIntention.trim());
      setNewIntention("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIntention();
    }
  };

  const handleSave = () => {
    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-modal animate-fade-in">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-ancient-gold sacred-header-glow text-center">
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-ancient-gold mr-2 sm:mr-3 md:mr-4 inline-block" 
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
            Intenções do Rosário
          </DialogTitle>
          <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full mt-4 sm:mt-6"></div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* New Intention Input */}
          <div>
            <Label className="text-sacred-ivory font-inter text-xs sm:text-sm">
              Nova Intenção
            </Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-2">
              <Input
                value={newIntention}
                onChange={(e) => setNewIntention(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: Pela paz no mundo, pela saúde da família..."
                className="flex-1 bg-[var(--ecclesiastical)] border-[var(--byzantine-gold-alpha)] text-sacred-ivory placeholder-sacred-ivory/50 focus:border-[var(--byzantine-gold)] focus:ring-[var(--byzantine-gold-glow)] rounded-lg text-sm sm:text-base h-10 sm:h-auto"
              />
              <Button
                onClick={handleAddIntention}
                className="px-3 sm:px-4 py-2 bg-[var(--byzantine-gold-alpha)] hover:bg-[var(--byzantine-gold-glow)] border border-[var(--byzantine-gold)] text-byzantine-gold font-inter rounded-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-auto"
              >
                Adicionar
              </Button>
            </div>
          </div>

          {/* Current Intentions */}
          <div>
            <h3 className="text-sacred-ivory font-inter text-xs sm:text-sm mb-2 sm:mb-3">
              Intenções Atuais{" "}
              <span className="text-byzantine-gold">({intentions.length})</span>
            </h3>
            <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto sacred-scroll">
              {intentions.length === 0 ? (
                <p className="text-sacred-ivory/60 text-xs sm:text-sm text-center py-3 sm:py-4">
                  Nenhuma intenção adicionada ainda
                </p>
              ) : (
                intentions.map((intention) => (
                  <div
                    key={intention.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-[var(--cathedral-shadow)]/30 rounded-lg border border-[var(--ancient-gold-alpha)] hover:border-[var(--ancient-gold-glow)] transition-all duration-300"
                  >
                    <span className="text-parchment text-xs sm:text-sm flex-1 font-crimson">
                      <i className="fas fa-heart text-ancient-gold mr-1 sm:mr-2 text-xs" />
                      {intention.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveIntention(intention.id)}
                      className="text-parchment/50 hover:text-red-400 hover:bg-red-400/10 ml-1 sm:ml-2 rounded-lg w-6 h-6 sm:w-8 sm:h-8 p-1 sm:p-2"
                    >
                      <i className="fas fa-times text-xs" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-[var(--ancient-gold-alpha)]">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="px-4 sm:px-6 py-2 sm:py-3 glass-morphism hover:bg-parchment/10 text-parchment font-inter rounded-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-[var(--ancient-gold-alpha)] hover:bg-[var(--ancient-gold-glow)] border border-[var(--ancient-gold)] text-ancient-gold font-inter rounded-lg transition-all duration-300 text-sm sm:text-base h-10 sm:h-auto"
            >
              Salvar Intenções
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
