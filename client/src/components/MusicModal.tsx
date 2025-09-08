import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useCallback } from "react";
import { useAudioContext } from "@/contexts/AudioContext";
import { gregorianSongs, getSongById, getNextSong, getPreviousSong, formatTime } from "@/lib/audioUtils";

interface MusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MusicModal({ 
  open, 
  onOpenChange
}: MusicModalProps) {
  const [repeatMode, setRepeatMode] = useState(false);
  
  // Use shared audio context
  const audioContext = useAudioContext();

  // Initialize with first song if no current song
  useEffect(() => {
    if (!audioContext.currentSong) {
      audioContext.setCurrentSong('adoro-te-devote');
    }
  }, [audioContext]);

  // Get current song data
  const currentSongData = getSongById(audioContext.currentSong || 'adoro-te-devote') || gregorianSongs[0];

  const handleSongSelect = (songId: string) => {
    audioContext.loadSong(songId, true); // Always autoplay when manually selecting a song
  };

  const handleNext = () => {
    const nextSong = getNextSong(audioContext.currentSong || 'adoro-te-devote', audioContext.shuffleMode);
    audioContext.loadSong(nextSong, true); // Always autoplay when clicking next
  };

  const handlePrevious = () => {
    const previousSong = getPreviousSong(audioContext.currentSong || 'adoro-te-devote');
    audioContext.loadSong(previousSong, true); // Always autoplay when clicking previous
  };

  const handleShuffle = () => {
    audioContext.toggleShuffle();
  };

  const handleRepeat = () => {
    const newRepeatMode = !repeatMode;
    setRepeatMode(newRepeatMode);
    console.log('Repeat mode:', newRepeatMode);
  };

  const handleVolumeChange = (value: number[]) => {
    const volume = value[0] / 100;
    audioContext.setVolume(volume);
  };

  const handleProgressChange = (value: number[]) => {
    const time = (value[0] / 100) * audioContext.duration;
    audioContext.seekTo(time);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sacred-modal !max-w-none !w-full">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-ancient-gold sacred-header-glow text-center">
            <i className="fas fa-music mr-2 sm:mr-3 md:mr-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
            Música Sacra
          </DialogTitle>
          <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full mt-4 sm:mt-6"></div>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Current Song Display */}
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-cinzel text-ancient-gold font-medium">
              {currentSongData.title}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-secondary font-inter">
              {currentSongData.latin}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-muted font-inter italic mt-1 sm:mt-2">
              {currentSongData.description}
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300 ${audioContext.shuffleMode ? '!bg-[var(--ancient-gold-glow-intense)] ring-2 ring-[var(--ancient-gold)]' : ''}`}
              onClick={handleShuffle}
              title="Aleatório"
            >
              <i className="fas fa-random text-ancient-gold text-sm sm:text-base md:text-lg" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300"
              onClick={handlePrevious}
              title="Anterior"
            >
              <i className="fas fa-step-backward text-ancient-gold text-sm sm:text-base md:text-lg" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300"
              onClick={audioContext.togglePlayPause}
              title={audioContext.isPlaying ? "Pausar" : "Tocar"}
              disabled={audioContext.isLoading}
            >
              {audioContext.isLoading ? (
                <i className="fas fa-circle-notch animate-spin text-ancient-gold text-lg sm:text-xl md:text-2xl" />
              ) : (
                <i className={`fas fa-${audioContext.isPlaying ? 'pause' : 'play'} text-ancient-gold text-lg sm:text-xl md:text-2xl`} />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300"
              onClick={handleNext}
              title="Próximo"
            >
              <i className="fas fa-step-forward text-ancient-gold text-sm sm:text-base md:text-lg" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300 ${repeatMode ? 'bg-[var(--ancient-gold-alpha)]' : ''}`}
              onClick={handleRepeat}
              title="Repetir"
            >
              <i className="fas fa-redo text-ancient-gold text-sm sm:text-base md:text-lg" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 sm:space-y-3">
            <Slider
              value={[audioContext.duration > 0 ? (audioContext.currentTime / audioContext.duration) * 100 : 0]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full h-2"
            />
            <div className="flex justify-between text-sm sm:text-base md:text-lg text-cathedral-stone-light font-inter">
              <span>{formatTime(audioContext.currentTime)}</span>
              <span>{formatTime(audioContext.duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <i className="fas fa-volume-down text-ancient-gold text-sm sm:text-base md:text-lg" />
            <Slider
              value={[audioContext.volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1 h-2"
            />
            <i className="fas fa-volume-up text-ancient-gold text-sm sm:text-base md:text-lg" />
          </div>

          {/* Song List */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-cinzel text-lg sm:text-xl md:text-2xl text-ancient-gold font-medium text-center">
              Cantos Gregorianos
            </h3>
            <ScrollArea className="h-60 sm:h-72 md:h-80 rounded-lg border border-ancient-gold/30 p-2 sm:p-3">
              <div className="space-y-2">
                {gregorianSongs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSongSelect(song.id)}
                    className={`w-full text-left p-2 sm:p-3 md:p-4 rounded-lg hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200 ${
                      audioContext.currentSong === song.id ? 'bg-[var(--ancient-gold-alpha)] text-ancient-gold' : 'text-secondary'
                    }`}
                  >
                    <div className="font-cinzel text-sm sm:text-base md:text-lg font-medium">
                      {song.title}
                      <span className="text-xs sm:text-sm text-muted ml-2">
                        {song.duration}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-secondary font-inter mt-1">
                      {song.latin}
                    </div>
                    <div className="text-xs text-muted font-inter italic mt-1">
                      {song.description}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}