import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioContext } from "@/contexts/AudioContext";
import { gregorianSongs, getSongById, getNextSong, getPreviousSong, formatTime } from "@/lib/audioUtils";

interface MiniMusicPlayerProps {
  onOpenFullPlayer: () => void;
}

export default function MiniMusicPlayer({ 
  onOpenFullPlayer
}: MiniMusicPlayerProps) {
  const [hasBeenPlaying, setHasBeenPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Use shared audio context
  const audioContext = useAudioContext();

  // Track when the player has been playing to maintain expanded state
  useEffect(() => {
    if (audioContext.isPlaying) {
      setHasBeenPlaying(true);
    }
  }, [audioContext.isPlaying]);

  // Get current song data
  const currentSongData = getSongById(audioContext.currentSong || 'adoro-te-devote') || gregorianSongs[0];

  const handleNext = () => {
    const nextSong = getNextSong(audioContext.currentSong || 'adoro-te-devote', audioContext.shuffleMode);
    audioContext.loadSong(nextSong, true);
  };

  const handlePrevious = () => {
    const previousSong = getPreviousSong(audioContext.currentSong || 'adoro-te-devote');
    audioContext.loadSong(previousSong, true);
  };

  const handleShuffle = () => {
    audioContext.toggleShuffle();
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
    <div className="flex items-center space-x-2">
      {/* Music Player - either collapsed button or expanded panel */}
      {!hasBeenPlaying ? (
        /* Collapsed Play Button - only shows when never played */
        <Button 
          variant="ghost"
          size="sm"
          className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300 sacred-interactive"
          onClick={audioContext.togglePlayPause}
          title="Tocar Música Sacra"
          disabled={audioContext.isLoading}
        >
          <i className="fas fa-music text-ancient-gold text-sm sacred-icon-hover" />
        </Button>
      ) : isMinimized ? (
        /* Minimized Play Button - shows when minimized with pulsing animation */
        <Button 
          variant="ghost"
          size="sm"
          className="p-2 w-10 h-10 rounded-full glass-morphism hover:bg-[var(--ancient-gold-alpha)] transition-all duration-300 sacred-interactive"
          onClick={() => setIsMinimized(false)}
          title="Expandir Player de Música"
          disabled={audioContext.isLoading}
        >
          <i className={`fas fa-music text-ancient-gold text-sm sacred-icon-hover ${
            audioContext.isPlaying ? 'animate-pulse' : ''
          }`} />
        </Button>
      ) : (
        /* Expanded Music Info Panel - shows when playing with pause button inside */
        <div className="glass-morphism rounded-lg border border-ancient-gold/30 p-2 bg-[var(--cathedral-shadow-alpha)] backdrop-blur-md min-w-[200px] max-w-[240px]">
          {/* Song Title and Controls */}
          <div className="flex items-center justify-between mb-1">
            <div 
              className="flex-1 font-cinzel text-ancient-gold truncate cursor-pointer hover:text-[var(--ancient-gold-bright)] transition-colors duration-200 mr-2 text-[14px]"
              onClick={onOpenFullPlayer}
              title={`${currentSongData.title} - Clique para abrir reprodutor completo`}
            >
              {currentSongData.title}
            </div>
            
            {/* Mini Controls including Play/Pause */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 w-6 h-6 rounded-full hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200"
                onClick={handlePrevious}
                title="Anterior"
              >
                <i className="fas fa-step-backward text-xs text-ancient-gold" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 w-7 h-7 rounded-full hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200"
                onClick={audioContext.togglePlayPause}
                title={audioContext.isPlaying ? "Pausar" : "Tocar"}
                disabled={audioContext.isLoading}
              >
                {audioContext.isLoading ? (
                  <i className="fas fa-circle-notch animate-spin text-xs text-ancient-gold" />
                ) : (
                  <i className={`fas fa-${audioContext.isPlaying ? 'pause' : 'play'} text-xs text-ancient-gold`} />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 w-6 h-6 rounded-full hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200"
                onClick={handleNext}
                title="Próximo"
              >
                <i className="fas fa-step-forward text-xs text-ancient-gold" />
              </Button>
              
              {/* Close Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 w-6 h-6 rounded-full hover:bg-red-500/20 transition-all duration-200 ml-1"
                onClick={() => {
                  audioContext.pause();
                  setHasBeenPlaying(false);
                }}
                title="Fechar player"
              >
                <i className="fas fa-times text-xs text-red-400 hover:text-red-300" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <Slider
              value={[audioContext.duration > 0 ? (audioContext.currentTime / audioContext.duration) * 100 : 0]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full h-1"
            />
            {/* Compact Bottom Row - Time, Shuffle, Volume, and Minimize Button */}
            <div className="flex items-center justify-between text-xs text-cathedral-stone-light font-inter mt-1">
              <span>{formatTime(audioContext.currentTime)}</span>
              
              {/* Center controls - Shuffle, Volume, and Minimize */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-1 w-6 h-6 rounded-full hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200 ${audioContext.shuffleMode ? 'bg-[var(--ancient-gold-alpha)]' : ''}`}
                  onClick={handleShuffle}
                  title="Aleatório"
                >
                  <i className="fas fa-random text-xs text-ancient-gold" />
                </Button>
                
                <div className="flex items-center space-x-1 w-24">
                  <i className="fas fa-volume-down text-xs text-cathedral-stone-light" />
                  <Slider
                    value={[audioContext.volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    className="flex-1 h-1"
                  />
                </div>
                
                {/* Minimize Button - same prominence as shuffle button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 w-6 h-6 rounded-full hover:bg-[var(--ancient-gold-alpha)] transition-all duration-200"
                  onClick={() => setIsMinimized(true)}
                  title="Minimizar player"
                >
                  <i className="fas fa-eye-slash text-xs text-ancient-gold" />
                </Button>
              </div>
              
              <span>{formatTime(audioContext.duration)}</span>
            </div>
          </div>
          
          {/* Loading State */}
          {audioContext.isLoading && (
            <div className="absolute inset-0 bg-[var(--cathedral-shadow-alpha)] backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-1 text-ancient-gold">
                <i className="fas fa-circle-notch animate-spin text-xs" />
                <span className="text-xs font-inter">Carregando...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}