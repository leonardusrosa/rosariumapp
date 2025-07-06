import { useState, useRef, useCallback, useEffect } from 'react';
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

// Global flag to track if user has interacted with the page
let hasUserInteracted = false;

// Set up global user interaction detection
if (typeof document !== 'undefined' && !hasUserInteracted) {
  const markUserInteraction = () => {
    hasUserInteracted = true;
    console.log('User interaction detected - auto-play now enabled');
  };
  
  document.addEventListener('click', markUserInteraction, { once: true });
  document.addEventListener('keydown', markUserInteraction, { once: true });
  document.addEventListener('touchstart', markUserInteraction, { once: true });
}

export function useSimpleAudioWithAutoplay(onSongEnd?: (currentSongId: string) => void) {
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
  const shouldAutoPlayRef = useRef<boolean>(false);
  const onSongEndRef = useRef(onSongEnd);

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

    // Set auto-play flag
    shouldAutoPlayRef.current = autoPlay;
    console.log('Loading song:', songId, 'Auto-play flag set to:', autoPlay);

    // Create new audio element
    const audio = new Audio();
    audioRef.current = audio;

    // Set up event listeners
    const handleLoadedData = () => {
      setState(prev => ({ 
        ...prev, 
        duration: audio.duration || 0,
        isLoading: false,
        error: null
      }));
      console.log('Audio loaded successfully:', songId, 'Duration:', audio.duration);
      
      // Only attempt autoplay here if we have user interaction
      if (shouldAutoPlayRef.current && hasUserInteracted) {
        console.log('Attempting auto-play on loadeddata for:', songId, 'Flag:', shouldAutoPlayRef.current);
        
        // Longer delay for slow-loading files (benedictus, credo, pater-noster)
        const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(songId);
        const delay = isSlowFile ? 400 : 50; // Even longer delay for slow files
        
        setTimeout(() => {
          if (shouldAutoPlayRef.current && audioRef.current) {
            console.log('Executing delayed autoplay for:', songId, 'readyState:', audioRef.current.readyState);
            
            // Force a small buffer check for slow files
            if (isSlowFile && audioRef.current.readyState < 2) {
              console.log('Slow file not ready, skipping loadeddata autoplay for:', songId, 'readyState:', audioRef.current.readyState);
              return; // Let canplaythrough handle it
            }
            
            audioRef.current.play().then(() => {
              console.log('Auto-play successful on loadeddata for:', songId);
              shouldAutoPlayRef.current = false;
            }).catch((error) => {
              console.log('Auto-play failed on loadeddata for:', songId, error);
              // Don't clear flag immediately for slow files - let canplaythrough try
              if (!isSlowFile) {
                shouldAutoPlayRef.current = false;
              }
            });
          } else {
            console.log('Autoplay skipped - flag cleared or no audio ref for:', songId, 'Flag:', shouldAutoPlayRef.current);
          }
        }, delay);
      } else {
        console.log('No autoplay attempt for:', songId, 'Flag:', shouldAutoPlayRef.current, 'UserInteracted:', hasUserInteracted);
      }
    };

    const handleCanPlayThrough = () => {
      // More aggressive autoplay for slow-loading files
      if (shouldAutoPlayRef.current && audioRef.current && hasUserInteracted) {
        console.log('Attempting auto-play on canplaythrough for:', songId);
        
        // Extra delay for problematic files to ensure they're fully buffered
        const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(songId);
        const delay = isSlowFile ? 200 : 50;
        
        setTimeout(() => {
          if (shouldAutoPlayRef.current && audioRef.current) {
            audioRef.current.play().then(() => {
              console.log('Auto-play successful on canplaythrough for:', songId);
              shouldAutoPlayRef.current = false;
            }).catch((error) => {
              console.log('Auto-play failed on canplaythrough for:', songId, error);
              shouldAutoPlayRef.current = false;
            });
          }
        }, delay);
      }
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
      shouldAutoPlayRef.current = false; // Clear auto-play flag when successfully playing
      console.log('Audio actually started playing for:', songId);
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      shouldAutoPlayRef.current = false; // Clear flag when song ends
      console.log('Audio ended for:', songId);
      // Call the onSongEnd callback if provided
      if (onSongEndRef.current && songId) {
        console.log('Calling onSongEnd callback for:', songId);
        onSongEndRef.current(songId);
      }
    };

    const handleError = (e: Event) => {
      // Only show errors for genuine failures
      if (audio.duration <= 0 && audio.readyState < 2) {
        console.error('Audio loading error for:', songId, e);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load audio file',
          isPlaying: false 
        }));
        shouldAutoPlayRef.current = false; // Clear flag on error
      }
    };

    // Special handler for problematic files that need extra autoplay attempts
    const handleCanPlay = () => {
      const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(songId);
      if (isSlowFile && shouldAutoPlayRef.current && hasUserInteracted && audioRef.current) {
        console.log('CanPlay event - attempting autoplay for slow file:', songId);
        setTimeout(() => {
          if (shouldAutoPlayRef.current && audioRef.current && !state.isPlaying) {
            audioRef.current.play().then(() => {
              console.log('Auto-play successful on canplay for:', songId);
              shouldAutoPlayRef.current = false;
            }).catch((error) => {
              console.log('Auto-play failed on canplay for:', songId, error);
            });
          }
        }, 100);
      }
    };

    // Attach event listeners
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay); // Additional event for slow files
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Load the audio with enhanced preloading for problematic files
    audio.src = songData.audioPath;
    const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(songId);
    audio.preload = isSlowFile ? 'auto' : 'metadata'; // Force full preload for slow files
    audio.volume = 0.8; // Set initial volume
    
    // For slow files, add crossorigin to help with buffering
    if (isSlowFile) {
      audio.crossOrigin = 'anonymous';
    }
    
    audio.load();

    console.log('Loading song:', songId, 'from:', songData.audioPath);
  }, []);

  // Fallback auto-play effect for slow-loading audio
  useEffect(() => {
    if (shouldAutoPlayRef.current && !state.isLoading && state.duration > 0 && !state.isPlaying && audioRef.current && hasUserInteracted) {
      console.log('Fallback auto-play from useEffect for:', state.currentSong, 'readyState:', audioRef.current.readyState);
      
      // Longer delay for problematic files
      const isSlowFile = ['benedictus', 'credo', 'pater-noster'].includes(state.currentSong || '');
      const fallbackDelay = isSlowFile ? 800 : 200; // Much longer delay for problematic files
      
      const fallbackTimeout = setTimeout(() => {
        if (shouldAutoPlayRef.current && audioRef.current && !state.isPlaying) {
          console.log('Attempting fallback auto-play for:', state.currentSong);
          
          // Multiple attempts for slow files
          const attemptFallbackPlay = (attempt = 1) => {
            if (!shouldAutoPlayRef.current || !audioRef.current) return;
            
            audioRef.current.play().then(() => {
              console.log(`Fallback auto-play successful attempt ${attempt} for:`, state.currentSong);
              shouldAutoPlayRef.current = false;
            }).catch((error) => {
              console.log(`Fallback auto-play attempt ${attempt} failed for:`, state.currentSong, error);
              
              if (isSlowFile && attempt < 2) {
                // One more attempt for slow files
                setTimeout(() => attemptFallbackPlay(attempt + 1), 300);
              } else {
                shouldAutoPlayRef.current = false;
              }
            });
          };
          
          attemptFallbackPlay();
        }
      }, fallbackDelay);

      return () => clearTimeout(fallbackTimeout);
    }
  }, [state.isLoading, state.duration, state.isPlaying, state.currentSong]);

  const play = useCallback(() => {
    if (audioRef.current && !state.isLoading) {
      hasUserInteracted = true; // Mark that user has interacted
      audioRef.current.play().then(() => {
        // Clear auto-play flag when manual play succeeds
        shouldAutoPlayRef.current = false;
      }).catch((error) => {
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
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    }
  }, [state.duration]);

  // Update the callback ref when it changes
  useEffect(() => {
    onSongEndRef.current = onSongEnd;
  }, [onSongEnd]);

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