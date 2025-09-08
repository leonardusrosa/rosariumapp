import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFontSize } from "@/hooks/useFontSize";

interface FontSizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fontSizeOptions = [
  { value: 'lg' as const, label: '20px', index: 0 }, // Standard (old "Muito Grande")
  { value: 'xl' as const, label: '24px', index: 1 },
  { value: '2xl' as const, label: '30px', index: 2 },
  { value: '3xl' as const, label: '36px', index: 3 },
  { value: '4xl' as const, label: '48px', index: 4 }
];

export default function FontSizeModal({ open, onOpenChange }: FontSizeModalProps) {
  const { fontSize, setFontSize } = useFontSize();
  
  // Get current font size index
  const currentOption = fontSizeOptions.find(option => option.value === fontSize);
  const currentIndex = currentOption ? currentOption.index : 0; // Default to 20px (lg)
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const selectedOption = fontSizeOptions[value[0]];
    if (selectedOption) {
      setFontSize(selectedOption.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-modal !max-w-none !w-full">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-ancient-gold sacred-header-glow text-center">
            <i className="fas fa-font mr-2 sm:mr-3 md:mr-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
            Configurações de Fonte
          </DialogTitle>
          <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full mt-4 sm:mt-6"></div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8 mt-4 sm:mt-6 lg:mt-8">
          <p className="text-parchment/80 font-crimson text-center text-sm sm:text-base md:text-lg">
            Ajuste o tamanho da fonte para suas orações
          </p>

          {/* Font Size Preview */}
          <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl bg-[var(--cathedral-shadow)]/30 border border-[var(--ancient-gold-alpha)]">
            <div 
              className={`prayer-latin transition-all duration-300 ${
                fontSize === 'lg' ? 'text-lg sm:text-xl leading-relaxed tracking-wide' :      
                fontSize === 'xl' ? 'text-xl sm:text-2xl leading-snug tracking-wide' :     
                fontSize === '2xl' ? 'text-2xl sm:text-3xl leading-snug tracking-wide' :
                fontSize === '3xl' ? 'text-3xl sm:text-4xl leading-tight tracking-tight' :
                'text-4xl sm:text-5xl leading-tight tracking-tight'                            
              }`}
            >
              Ave Maria, gratia plena, Dominus tecum...
            </div>
            <p className="font-cinzel text-ancient-gold mt-3 sm:mt-4 text-sm sm:text-base md:text-lg">
              {currentOption?.label || '20px'}
            </p>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-4 sm:space-y-6">
            <div className="px-4 sm:px-6">
              <Slider
                value={[currentIndex]}
                onValueChange={handleSliderChange}
                max={4}
                min={0}
                step={1}
                className="w-full h-2"
              />
            </div>
            
            {/* Size Labels */}
            <div className="flex justify-between text-xs sm:text-sm md:text-base text-parchment/60 font-inter px-2 sm:px-4">
              <span>20px</span>
              <span className="text-ancient-gold font-medium">30px</span>
              <span>48px</span>
            </div>
          </div>

          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              onClick={() => onOpenChange(false)}
              className="sacred-button px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg h-10 sm:h-12 md:h-14"
            >
              <i className="fas fa-check mr-2 sm:mr-3 text-xs sm:text-sm md:text-base" />
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}