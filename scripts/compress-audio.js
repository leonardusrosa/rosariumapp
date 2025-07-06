#!/usr/bin/env node

/**
 * Script to compress audio files for better web performance
 * This reduces file sizes while maintaining acceptable quality for gregorian chant
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(__dirname, '..', 'client', 'public', 'audio');
const compressedDir = path.join(audioDir, 'compressed');

// Create compressed directory if it doesn't exist
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}

const compressionSettings = {
  // Optimized settings for Gregorian chant (primarily vocal)
  bitrate: '128k',     // Good balance between quality and size
  sampleRate: '44100', // Standard sample rate
  channels: 'mono',    // Most Gregorian chant is mono, saves space
  normalize: true      // Normalize audio levels
};

function compressAudioFile(inputFile) {
  const filename = path.basename(inputFile);
  const outputFile = path.join(compressedDir, filename);
  
  console.log(`Compressing ${filename}...`);
  
  try {
    // Get original file size
    const originalSize = fs.statSync(inputFile).size;
    
    // FFmpeg command for compression
    const command = [
      'ffmpeg',
      '-i', `"${inputFile}"`,
      '-y', // Overwrite output files
      '-ac', compressionSettings.channels === 'mono' ? '1' : '2',
      '-ar', compressionSettings.sampleRate,
      '-b:a', compressionSettings.bitrate,
      '-map_metadata', '-1', // Remove metadata to save space
      compressionSettings.normalize ? '-filter:a "loudnorm"' : '',
      `"${outputFile}"`
    ].filter(Boolean).join(' ');
    
    execSync(command, { stdio: 'inherit' });
    
    // Get compressed file size
    const compressedSize = fs.statSync(outputFile).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${filename}: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${compressionRatio}% reduction)`);
    
    return {
      original: originalSize,
      compressed: compressedSize,
      ratio: compressionRatio
    };
    
  } catch (error) {
    console.error(`❌ Error compressing ${filename}:`, error.message);
    return null;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function main() {
  console.log('🎵 Audio Compression Tool for Rosarium Virginis Mariae');
  console.log('='.repeat(60));
  
  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install FFmpeg first.');
    console.log('Installation commands:');
    console.log('  macOS: brew install ffmpeg');
    console.log('  Ubuntu: sudo apt install ffmpeg');
    console.log('  Windows: Download from https://ffmpeg.org/download.html');
    process.exit(1);
  }
  
  // Get all MP3 files in the audio directory
  const audioFiles = fs.readdirSync(audioDir)
    .filter(file => file.endsWith('.mp3'))
    .map(file => path.join(audioDir, file));
  
  if (audioFiles.length === 0) {
    console.log('No MP3 files found in the audio directory.');
    return;
  }
  
  console.log(`Found ${audioFiles.length} audio files to compress...\n`);
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  const results = [];
  
  // Compress each file
  for (const file of audioFiles) {
    const result = compressAudioFile(file);
    if (result) {
      results.push(result);
      totalOriginal += result.original;
      totalCompressed += result.compressed;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Compression Summary:');
  console.log(`Files processed: ${results.length}`);
  console.log(`Total original size: ${formatFileSize(totalOriginal)}`);
  console.log(`Total compressed size: ${formatFileSize(totalCompressed)}`);
  console.log(`Overall reduction: ${((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1)}%`);
  
  console.log('\n💡 Next steps:');
  console.log('1. Test the compressed files in the application');
  console.log('2. If quality is acceptable, replace the original files:');
  console.log('   cp client/public/audio/compressed/*.mp3 client/public/audio/');
  console.log('3. Remove the compressed directory:');
  console.log('   rm -rf client/public/audio/compressed/');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { compressAudioFile, formatFileSize };