import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { getSongById, getNextSong, getPreviousSong } from '@/lib/audioUtils';

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  currentSong: string | null;
  shuffleMode: boolean;
}

interface AudioContextType extends AudioState {
  loadSong: (songId: string, autoPlay?: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setCurrentSong: (songId: string) => void;
  playNext: (shuffleMode?: boolean) => void;
  playPrevious: (shuffleMode?: boolean) => void;
  toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Track user interaction for autoplay
let hasUserInteracted = false;
if (typeof document !== 'undefined' && !hasUserInteracted) {
  const markUserInteraction = () => {
    hasUserInteracted = true;
    console.log('User interaction detected - shared audio context auto-play enabled');
  };
  
  document.addEventListener('click', markUserInteraction, { once: true });
  document.addEventListener('keydown', markUserInteraction, { once: true });
  document.addEventListener('touchstart', markUserInteraction, { once: true });
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isLoading: false,
    error: null,
    currentSong: 'adoro-te-devote',
    shuffleMode: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoPlayRef = useRef<boolean>(false);
  const onSongEndCallbackRef = useRef<((songId: string) => void) | null>(null);

  const loadSong = useCallback((songId: string, autoPlay: boolean = false) => {
    console.log('Shared Audio Context - Loading song:', songId, 'Auto-play flag set to:', autoPlay);
    
    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const songData = getSongById(songId);
    if (!songData) {
      setState(prev => ({ ...prev, error: 'Song not found' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      currentSong: songId,
      isPlaying: false 
    }));

    // Store auto-play preference
    shouldAutoPlayRef.current = autoPlay;

    // Create new audio element
    const audio = new Audio();
    audio.volume = state.volume;
    audio.preload = 'auto';
    audio.src = songData.audioPath;
    audioRef.current = audio;

    console.log('Shared Audio Context - Loading song:', songId, 'from:', songData.audioPath);

    // Set up event listeners
    const handleLoadedData = () => {
      setState(prev => ({ 
        ...prev, 
        duration: audio.duration || 0,
        isLoading: false,
        error: null
      }));
      console.log('Shared Audio Context - Audio loaded successfully:', songId, 'Duration:', audio.duration);
      
      // Attempt autoplay if requested and user has interacted
      if (shouldAutoPlayRef.current && hasUserInteracted) {
        console.log('Shared Audio Context - Attempting auto-play for:', songId);
        const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(songId);
        const delay = isSlowFile ? 400 : 50;
        
        setTimeout(() => {
          if (shouldAutoPlayRef.current && audioRef.current) {
            audioRef.current.play().then(() => {
              console.log('Shared Audio Context - Auto-play successful for:', songId);
              shouldAutoPlayRef.current = false;
            }).catch((error) => {
              console.log('Shared Audio Context - Auto-play failed for:', songId, error);
            });
          }
        }, delay);
      } else {
        console.log('Shared Audio Context - No autoplay attempt for:', songId, 'Flag:', shouldAutoPlayRef.current, 'UserInteracted:', hasUserInteracted);
      }
    };

    const handleCanPlay = () => {
      const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(songId);
      if (isSlowFile && shouldAutoPlayRef.current && hasUserInteracted && audioRef.current) {
        console.log('Shared Audio Context - CanPlay event - attempting autoplay for slow file:', songId);
        setTimeout(() => {
          if (shouldAutoPlayRef.current && audioRef.current && !state.isPlaying) {
            audioRef.current.play().then(() => {
              console.log('Shared Audio Context - Auto-play successful on canplay for:', songId);
              shouldAutoPlayRef.current = false;
            }).catch((error) => {
              console.log('Shared Audio Context - Auto-play failed on canplay for:', songId, error);
            });
          }
        }, 100);
      }
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ 
        ...prev, 
        currentTime: audio.currentTime,
        duration: isNaN(audio.duration) ? prev.duration : audio.duration
      }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
      console.log('Shared Audio Context - Audio actually started playing for:', songId);
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleError = (e: Event) => {
      // Only log errors that aren't from cleanup/disposal
      if (audioRef.current && audioRef.current.src && audioRef.current.src !== '') {
        console.error('Shared Audio Context - Audio error for:', songId, e);
        setState(prev => ({ ...prev, error: 'Failed to load audio', isLoading: false }));
      }
      // Ignore errors from disposed audio elements (cleanup)
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      console.log('Shared Audio Context - Song ended:', songId);
      
      // Call the song end callback if set
      if (onSongEndCallbackRef.current) {
        onSongEndCallbackRef.current(songId);
      }
    };

    // Attach event listeners
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Cleanup function
    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.volume, state.isPlaying]);

  const play = useCallback(() => {
    if (audioRef.current && !state.isLoading) {
      audioRef.current.play().catch((error) => {
        console.error('Shared Audio Context - Play error:', error);
        setState(prev => ({ ...prev, error: 'Playback failed' }));
      });
    }
  }, [state.isLoading]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    // If no audio is loaded yet, load the current song and auto-play
    if (!audioRef.current && state.currentSong) {
      console.log('Shared Audio Context - No audio loaded, loading default song:', state.currentSong);
      loadSong(state.currentSong, true);
      return;
    }
    
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, state.currentSong, play, pause, loadSong]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    }
  }, [state.duration]);

  const setCurrentSong = useCallback((songId: string) => {
    setState(prev => ({ ...prev, currentSong: songId }));
  }, []);

  const playNext = useCallback((shuffleMode: boolean = false) => {
    if (state.currentSong) {
      const nextSong = getNextSong(state.currentSong, shuffleMode);
      loadSong(nextSong, true);
    }
  }, [state.currentSong, loadSong]);

  const playPrevious = useCallback((shuffleMode: boolean = false) => {
    if (state.currentSong) {
      const prevSong = getPreviousSong(state.currentSong);
      loadSong(prevSong, true);
    }
  }, [state.currentSong, loadSong]);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffleMode: !prev.shuffleMode }));
    console.log('Shuffle mode:', !state.shuffleMode);
  }, [state.shuffleMode]);

  // Set up song end callback for auto-advance
  const setSongEndCallback = useCallback((callback: (songId: string) => void) => {
    onSongEndCallbackRef.current = callback;
  }, []);

  const contextValue: AudioContextType = {
    ...state,
    loadSong,
    play,
    pause,
    togglePlayPause,
    setVolume,
    seekTo,
    setCurrentSong,
    playNext,
    playPrevious,
    toggleShuffle,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}