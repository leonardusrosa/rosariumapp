# Audio Feature Setup Guide

## Overview

The Sacred Rosary application now includes a comprehensive audio player system for Gregorian chants. The system supports play/pause, song navigation, volume control, shuffle, repeat, and progress tracking.

## Current Implementation

### Audio Player Features
- ✅ **Play/Pause Control**: Main playback button with visual feedback
- ✅ **Song Navigation**: Previous/Next track buttons
- ✅ **Progress Bar**: Interactive seeking with time display
- ✅ **Volume Control**: Adjustable audio volume slider
- ✅ **Shuffle Mode**: Random song selection
- ✅ **Repeat Mode**: Loop current song
- ✅ **Visual Feedback**: Playing animations and state indicators
- ✅ **Error Handling**: Displays audio loading errors
- ✅ **Auto-advance**: Automatic progression to next song

### Audio Files Structure
```
client/public/audio/
├── ave-maria.mp3 (4:23)
├── veni-creator.mp3 (3:45)
├── salve-regina.mp3 (5:12)
├── kyrie-eleison.mp3 (2:58)
├── gloria-in-excelsis.mp3 (6:34)
└── sanctus.mp3 (3:21)
```

## How to Add Real Audio Files

### Step 1: Obtain Gregorian Chant Recordings

**Public Domain Sources:**
- **Archive.org**: Search for "Gregorian chant" + specific prayers
- **Freesound.org**: Creative Commons licensed religious music
- **CPDL (Choral Public Domain Library)**: Free sheet music and recordings

**High-Quality Sources:**
- Solesmes Abbey recordings
- Benedictine monastery collections
- Classical music archives

### Step 2: Prepare Audio Files

1. **Format Requirements:**
   - Preferred: MP3 (best browser compatibility)
   - Alternative: OGG (fallback format)
   - Sample rate: 44.1 kHz or higher
   - Bit rate: 192 kbps minimum (256 kbps recommended)

2. **File Naming:**
   - Use exact filenames as specified in the app
   - No spaces or special characters
   - Include file extensions (.mp3)

3. **Audio Processing:**
   - Normalize audio levels for consistent volume
   - Remove silence from beginning/end
   - Ensure clear, high-quality recordings

### Step 3: Replace Placeholder Files

1. **Replace the placeholder files in `client/public/audio/`:**
   ```bash
   # Remove placeholder files
   rm client/public/audio/*.mp3
   
   # Add your real audio files
   cp path/to/your/audio/ave-maria.mp3 client/public/audio/
   cp path/to/your/audio/veni-creator.mp3 client/public/audio/
   # ... (repeat for all 6 files)
   ```

2. **Update durations in `client/src/lib/audioUtils.ts`:**
   ```typescript
   // Update the duration strings to match your actual audio files
   {
     id: 'ave-maria',
     title: 'Ave Maria',
     latin: 'Ave Maria, gratia plena',
     duration: '4:23', // ← Update this
     description: 'Tradicional canto mariano gregoriano',
     audioPath: '/audio/ave-maria.mp3'
   }
   ```

### Step 4: Test the Audio Player

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Test each song:**
   - Open the music modal (music icon in top-right)
   - Try play/pause for each song
   - Test volume control
   - Test shuffle and repeat modes
   - Verify progress bar functionality

## Audio Player API

### Components
- `useAudioPlayer()`: Main audio player hook
- `MusicModal`: UI component for music controls
- `audioUtils.ts`: Song data and utility functions

### Usage Example
```typescript
const audioPlayer = useAudioPlayer({
  onSongEnd: (songId) => {
    // Handle song completion
  },
  onError: (error) => {
    // Handle audio errors
  }
});

// Load and play a song
audioPlayer.loadSong('ave-maria');
audioPlayer.togglePlayPause();
```

## Troubleshooting

### Common Issues

1. **Audio won't play:**
   - Check file paths are correct
   - Verify audio files exist in `client/public/audio/`
   - Ensure MP3 format compatibility

2. **No sound:**
   - Check volume level
   - Verify browser audio permissions
   - Test with different audio files

3. **Performance issues:**
   - Optimize audio file sizes
   - Use appropriate bit rates
   - Consider audio compression

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Legal Considerations

- Ensure you have proper licensing for all audio files
- Public domain recordings are safest
- Credit sources when required
- Respect copyright laws

## Future Enhancements

Potential improvements to consider:

1. **Playlist Management**: Save custom playlists
2. **Audio Quality Selection**: Multiple quality options
3. **Offline Caching**: Store audio locally
4. **Background Play**: Continue during navigation
5. **Equalizer**: Audio tone adjustments
6. **Crossfade**: Smooth transitions between songs

## Technical Notes

- Audio files are served from the public directory
- The player uses HTML5 Audio API
- State management via React hooks
- Progress tracking with localStorage
- Error handling for missing files