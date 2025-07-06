import { useState, useEffect, useRef, useCallback } from 'react';
import { getSongById } from '../lib/audioUtils';

interface AudioPlayerOptions {
  onSongEnd?: (currentSongId: string) => void;
  onError?: (error: Error) => void;
  volume?: number;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export function useAudioPlayer(options: AudioPlayerOptions = {}) {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: options.volume || 0.8,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongRef = useRef<string | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;

    const audio = audioRef.current;

    // Event listeners
    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    };

    const handleLoadedData = () => {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        duration: audio.duration || 0 
      }));
    };

    const handleCanPlay = () => {
      console.log('Audio can play:', currentSongRef.current);
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({ 
        ...prev, 
        currentTime: audio.currentTime || 0 
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
      if (options.onSongEnd && currentSongRef.current) {
        options.onSongEnd(currentSongRef.current);
      }
    };

    const handleError = (error: Event) => {
      const audioElement = error.target as HTMLAudioElement;
      const networkState = audioElement?.networkState;
      const readyState = audioElement?.readyState;
      
      let errorMessage = `Audio error for: ${currentSongRef.current || 'Unknown'}`;
      
      // Provide more specific error information
      if (networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        errorMessage = `Audio file not found: ${currentSongRef.current}`;
      } else if (networkState === HTMLMediaElement.NETWORK_LOADING) {
        errorMessage = `Network error loading: ${currentSongRef.current}. Please check your connection.`;
      } else if (audioElement?.error) {
        switch (audioElement.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = `Playback aborted: ${currentSongRef.current}. Try again.`;
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = `Network error: ${currentSongRef.current}. Check your connection.`;
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = `Audio decode error: ${currentSongRef.current}. File may be corrupted.`;
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = `Audio format not supported: ${currentSongRef.current}`;
            break;
        }
      }
      
      console.error('Audio error details:', {
        songId: currentSongRef.current,
        networkState,
        readyState,
        errorCode: audioElement?.error?.code,
        src: audioElement?.src,
        fileSize: audioElement?.src ? 'Large file - consider compression' : 'Unknown'
      });
      
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false,
        error: errorMessage 
      }));
      
      if (options.onError) {
        options.onError(new Error(errorMessage));
      }
    };

    // Attach event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      // Cleanup
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [options.onSongEnd, options.onError, state.volume]);

  // Load song with retry mechanism
  const loadSong = useCallback((songId: string, retryCount: number = 0) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    currentSongRef.current = songId;

    // Clear any previous errors and set loading state
    setState(prev => ({ ...prev, error: null, isLoading: true }));

    // Get the proper audio path from audioUtils
    const songData = getSongById(songId);
    const audioPath = songData?.audioPath || `/audio/${songId}.mp3`;
    console.log('Loading audio:', audioPath, retryCount > 0 ? `(retry ${retryCount})` : '');
    
    // Configure audio element for progressive loading (better for large files)
    audio.preload = 'none'; // Start with no preload for faster initial response
    audio.crossOrigin = 'anonymous';
    
    // Configure for better large file handling
    audio.setAttribute('controls', 'true'); // Enable native controls temporarily
    audio.style.display = 'none'; // Hide from UI
    
    // Reset audio element before loading new source
    audio.pause();
    audio.currentTime = 0;
    audio.src = audioPath;

    let loadTimeout: NodeJS.Timeout;
    let hasLoaded = false;

    // Clear timeout and update state when audio has enough data to start playing
    const handleLoadSuccess = () => {
      if (hasLoaded) return; // Prevent multiple calls
      hasLoaded = true;
      
      clearTimeout(loadTimeout);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        duration: audio.duration || 0
      }));
      console.log('Audio loaded successfully:', songId, 'Duration:', audio.duration);
    };

    const handleLoadError = () => {
      if (hasLoaded) return;
      hasLoaded = true;
      
      clearTimeout(loadTimeout);
      
      // Try retry if this is the first failure
      if (retryCount < 2) {
        console.log('Retrying audio load for:', songId);
        setTimeout(() => {
          loadSong(songId, retryCount + 1);
        }, 1000); // Wait 1 second before retry
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: `Unable to load audio file. The file may be too large or corrupted.` 
      }));
      console.error('Audio loading failed after retries for:', songId);
    };

    // Set a timeout for loading (reduced to 15 seconds for initial attempt)
    loadTimeout = setTimeout(() => {
      if (hasLoaded) return;
      
      if (audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        handleLoadError();
      }
    }, retryCount === 0 ? 15000 : 30000); // 15s for first try, 30s for retries

    // Event listeners for successful loading
    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ 
        ...prev,
        duration: audio.duration || 0
      }));
      // Don't mark as fully loaded yet, wait for canplay
    }, { once: true });

    audio.addEventListener('canplay', handleLoadSuccess, { once: true });
    
    // Handle errors
    audio.addEventListener('error', handleLoadError, { once: true });

    // Start loading - change preload to metadata after setting up listeners
    audio.preload = 'metadata';
    audio.load();
  }, []);

  // Play/pause functionality
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    // If audio hasn't loaded enough data yet, trigger progressive loading
    if (audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA && audio.src) {
      console.log('Audio not ready, forcing progressive load...');
      audio.preload = 'auto'; // Enable progressive loading when user wants to play
      audio.load(); // Trigger loading
      setState(prev => ({ ...prev, isLoading: true }));
      return;
    }
    
    if (state.isPlaying) {
      audio.pause();
    } else {
      // Try to play immediately, let the browser handle buffering
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          let errorMessage = 'Failed to play audio';
          
          if (error.name === 'NotAllowedError') {
            errorMessage = 'Click play button to enable audio';
          } else if (error.name === 'NotSupportedError') {
            errorMessage = 'Audio format not supported';
          } else if (error.name === 'AbortError') {
            errorMessage = 'Playback interrupted. Try again.';
          } else if (error.name === 'NotEnoughDataError') {
            errorMessage = 'Still loading. Please wait a moment.';
          }
          
          setState(prev => ({ 
            ...prev, 
            error: errorMessage 
          }));
        });
      }
    }
  }, [state.isPlaying]);

  // Seek to specific time
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
  }, [state.duration]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  return {
    ...state,
    loadSong,
    togglePlayPause,
    seekTo,
    setVolume,
    stop,
  };
}