#!/usr/bin/env node

/**
 * Script to generate placeholder audio files for testing the music feature
 * This creates silent audio files that can be used for development and testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audio file paths
const audioDir = path.join(__dirname, '..', 'client', 'src', 'assets', 'audio');
const publicAudioDir = path.join(__dirname, '..', 'client', 'public', 'audio');

// Song list matching the app's configuration
const songs = [
  { id: 'ave-maria', duration: 263 }, // 4:23
  { id: 'veni-creator', duration: 225 }, // 3:45  
  { id: 'salve-regina', duration: 312 }, // 5:12
  { id: 'kyrie-eleison', duration: 178 }, // 2:58
  { id: 'gloria-in-excelsis', duration: 394 }, // 6:34
  { id: 'sanctus', duration: 201 } // 3:21
];

// Create directories if they don't exist
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

if (!fs.existsSync(publicAudioDir)) {
  fs.mkdirSync(publicAudioDir, { recursive: true });
}

console.log('🎵 Generating sample audio files for Sacred Rosary...');
console.log('');

// Generate placeholder audio files
songs.forEach(song => {
  const filename = `${song.id}.mp3`;
  const audioPath = path.join(publicAudioDir, filename);
  
  // Create a minimal MP3 file header (silent audio)
  // This is just a placeholder - in production, you'd use real Gregorian chant recordings
  const silentMp3Header = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, // MP3 frame header
    0x00, 0x00, 0x00, 0x00, // Silent data
    0x00, 0x00, 0x00, 0x00
  ]);
  
  try {
    fs.writeFileSync(audioPath, silentMp3Header);
    console.log(`✅ Created: ${filename} (${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')})`);
  } catch (error) {
    console.error(`❌ Failed to create ${filename}:`, error.message);
  }
});

console.log('');
console.log('📋 Next steps:');
console.log('1. Replace these placeholder files with real Gregorian chant recordings');
console.log('2. Ensure audio files are in MP3 format for best browser compatibility');
console.log('3. Test the music player functionality in the application');
console.log('');
console.log('💡 Tip: High-quality Gregorian chant recordings can be found at:');
console.log('   - Archive.org (public domain recordings)');
console.log('   - Freesound.org (Creative Commons)');
console.log('   - Your local monastery or church recordings');