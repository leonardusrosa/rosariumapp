import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

async function buildForVercel() {
  console.log('Building for Vercel...');
  
  // Ensure output directory exists
  const outputDir = 'dist/public';
  mkdirSync(outputDir, { recursive: true });
  
  // Build frontend with Vite (with chunk size limit adjusted)
  console.log('Building frontend...');
  try {
    execSync('vite build --outDir dist/public --chunkSizeWarningLimit 1000', { stdio: 'inherit' });
    console.log('Frontend build completed successfully!');
  } catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
  }
  
  // Build server files for API functions
  console.log('Building server files for API...');
  try {
    execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server', { stdio: 'inherit' });
    execSync('esbuild shared/schema.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/shared', { stdio: 'inherit' });
    console.log('Server files build completed successfully!');
  } catch (error) {
    console.error('Server build failed:', error);
    process.exit(1);
  }
  
  // Verify build output
  if (existsSync('dist/public/index.html')) {
    console.log('✓ index.html found in build output');
  } else {
    console.error('✗ index.html not found in build output');
    process.exit(1);
  }
  
  console.log('Build completed successfully!');
  console.log('API functions will be handled by Vercel automatically');
}

buildForVercel().catch(console.error);
