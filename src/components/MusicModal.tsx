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
  const [shuffleMode, setShuffleMode] = useState(false);
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
    const nextSong = getNextSong(audioContext.currentSong || 'adoro-te-devote', shuffleMode);
    audioContext.loadSong(nextSong, true); // Always autoplay when clicking next
  };

  const handlePrevious = () => {
    const previousSong = getPreviousSong(audioContext.currentSong || 'adoro-te-devote');
    audioContext.loadSong(previousSong, true); // Always autoplay when clicking previous
  };

  const handleShuffle = () => {
    const newShuffleMode = !shuffleMode;
    setShuffleMode(newShuffleMode);
    console.log('Shuffle mode:', newShuffleMode);
    
    // When turning shuffle ON, immediately play a random song with autoplay
    if (newShuffleMode) {
      const nextSong = getNextSong(audioContext.currentSong || 'adoro-te-devote', true);
      audioContext.loadSong(nextSong, true);
    }
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
      <DialogContent className="sacred-modal max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-cinzel text-2xl font-medium text-ancient-gold sacred-header-glow text-center">
            <i className="fas fa-music mr-3" />
            Música Sacra
          </DialogTitle>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--ancient-gold)] to-transparent mx-auto rounded-full mt-4"></div>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Current Song Display */}
          <div className="text-center space-y-2">
            <div className="text-xl font-cinzel text-ancient-gold font-medium">
              {currentSongData.title}
            </div>
            <div className="text-sm text-cathedral-stone-light font-inter">
              {currentSongData.latin}
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300 ${shuffleMode ? 'bg-[var(--ancient-gold-alpha)]' : ''}`}
              onClick={handleShuffle}
              title="Aleatório"
            >
              <i className="fas fa-random text-ancient-gold" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300"
              onClick={handlePrevious}
              title="Anterior"
            >
              <i className="fas fa-step-backward text-ancient-gold" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-3 w-14 h-14 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300"
              onClick={audioContext.togglePlayPause}
              title={audioContext.isPlaying ? "Pausar" : "Tocar"}
              disabled={audioContext.isLoading}
            >
              {audioContext.isLoading ? (
                <i className="fas fa-circle-notch animate-spin text-ancient-gold text-xl" />
              ) : (
                <i className={`fas fa-${audioContext.isPlaying ? 'pause' : 'play'} text-ancient-gold text-xl`} />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300"
              onClick={handleNext}
              title="Próximo"
            >
              <i className="fas fa-step-forward text-ancient-gold" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300 ${repeatMode ? 'bg-[var(--ancient-gold-alpha)]' : ''}`}
              onClick={handleRepeat}
              title="Repetir"
            >
              <i className="fas fa-redo text-ancient-gold" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[audioContext.duration > 0 ? (audioContext.currentTime / audioContext.duration) * 100 : 0]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-cathedral-stone-light font-inter">
              <span>{formatTime(audioContext.currentTime)}</span>
              <span>{formatTime(audioContext.duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <i className="fas fa-volume-down text-ancient-gold" />
            <Slider
              value={[audioContext.volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <i className="fas fa-volume-up text-ancient-gold" />
          </div>

          {/* Song List */}
          <div className="space-y-2">
            <h3 className="font-cinzel text-lg text-ancient-gold font-medium text-center">
              Cantos Gregorianos
            </h3>
            <ScrollArea className="h-64 rounded-lg border border-ancient-gold/30 p-2">
              <div className="space-y-1">
                {gregorianSongs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSongSelect(song.id)}
                    className={`w-full text-left p-2 rounded-lg hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200 ${
                      audioContext.currentSong === song.id ? 'bg-[var(--ancient-gold-alpha)] text-ancient-gold' : 'text-cathedral-stone-light'
                    }`}
                  >
                    <div className="font-cinzel text-sm font-medium">
                      {song.title}
                    </div>
                    <div className="text-xs text-cathedral-stone-light font-inter">
                      {song.latin}
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