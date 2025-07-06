import { useState, useEffect, useRef, useCallback } from 'react';

interface SimpleAudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
}

export function useSimpleAudioPlayer() {
  const [state, setState] = useState<SimpleAudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isLoading: false,
    error: null,
    isReady: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongRef = useRef<string | null>(null);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = state.volume;
    audio.preload = 'auto';
    
    // Set up event listeners
    const updateTime = () => {
      setState(prev => ({ 
        ...prev, 
        currentTime: audio.currentTime,
        duration: isNaN(audio.duration) ? 0 : audio.duration
      }));
    };

    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true, error: null, isReady: false }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isReady: true,
        duration: isNaN(audio.duration) ? 0 : audio.duration 
      }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handleError = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false,
        isReady: false,
        error: `Failed to load: ${currentSongRef.current || 'Unknown song'}` 
      }));
    };

    // Attach listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const loadSong = useCallback((songId: string) => {
    if (!audioRef.current) return;

    currentSongRef.current = songId;
    const audio = audioRef.current;
    
    // Stop current playback
    audio.pause();
    audio.currentTime = 0;
    
    // Set new source
    audio.src = `/audio/${songId}.mp3`;
    console.log('Simple player loading:', songId);
    
    // Load the audio
    audio.load();
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || !state.isReady) {
      setState(prev => ({ ...prev, error: 'Audio not ready yet' }));
      return;
    }

    try {
      await audioRef.current.play();
      setState(prev => ({ ...prev, error: null }));
    } catch (error) {
      console.error('Play error:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Click to enable audio playback' 
      }));
    }
  }, [state.isReady]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!audioRef.current || !state.isReady) return;
    
    audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
  }, [state.duration, state.isReady]);

  return {
    ...state,
    loadSong,
    play,
    pause,
    togglePlayPause,
    setVolume,
    seekTo,
  };
}