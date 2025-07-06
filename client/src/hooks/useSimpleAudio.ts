import { useState, useRef, useCallback } from 'react';
import { getSongById } from '../lib/audioUtils';

interface SimpleAudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  currentSong: string | null;
}

export function useSimpleAudio() {
  const [state, setState] = useState<SimpleAudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isLoading: false,
    error: null,
    currentSong: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadSong = useCallback((songId: string, autoPlay: boolean = false) => {
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

    // Create new audio element
    const audio = new Audio();
    audioRef.current = audio;

    // Store auto-play preference for later use
    let shouldAutoPlay = autoPlay;

    // Set up event listeners
    const handleLoadedData = () => {
      setState(prev => ({ 
        ...prev, 
        duration: audio.duration || 0,
        isLoading: false,
        error: null // Clear error when audio loads successfully
      }));
      console.log('Audio loaded successfully:', songId, 'Duration:', audio.duration);
      
      // Try auto-play if requested
      if (shouldAutoPlay && audio.readyState >= 2) {
        audio.play().then(() => {
          console.log('Auto-play successful for:', songId);
          shouldAutoPlay = false; // Reset flag
        }).catch((error) => {
          console.log('Auto-play blocked by browser for:', songId);
          // Don't show error for auto-play blocking - this is normal browser behavior
          shouldAutoPlay = false; // Reset flag
        });
      }
    };

    const handleCanPlay = () => {
      // Try auto-play when audio can play if still requested
      if (shouldAutoPlay && audio.readyState >= 2) {
        audio.play().then(() => {
          console.log('Auto-play successful for:', songId);
          shouldAutoPlay = false; // Reset flag
        }).catch((error) => {
          console.log('Auto-play blocked by browser for:', songId);
          // Don't show error - browser auto-play blocking is normal
          shouldAutoPlay = false; // Reset flag
        });
      }
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleError = (e: Event) => {
      // Don't log errors for successful loads or when audio is working
      if (audio.duration > 0 || audio.readyState >= 2) {
        return; // Audio is working fine, ignore spurious error events
      }
      
      console.error('Audio loading error for:', songId, e);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load audio file',
        isPlaying: false 
      }));
    };

    // Attach event listeners
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handlePause);

    // Load the audio
    audio.src = songData.audioPath;
    audio.preload = 'metadata';
    audio.load();

    console.log('Loading song:', songId, 'from:', songData.audioPath);
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && !state.isLoading) {
      audioRef.current.play().catch((error) => {
        console.error('Play error:', error);
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
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    // Update state to sync visual controls
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    }
  }, [state.duration]);

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