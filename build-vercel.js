import { execSync } from 'child_process';
import { cpSync } from 'fs';
import { existsSync } from 'fs';

async function buildForVercel() {
  console.log('Building for Vercel...');
  
  // Ensure attached_assets directory exists and is accessible during build
  console.log('Preparing assets for build...');
  if (existsSync('attached_assets')) {
    console.log('Assets directory found and ready for build');
  } else {
    console.log('Warning: No attached_assets directory found');
  }
  
  // Build frontend with Vite
  console.log('Building frontend...');
  execSync('vite build --outDir dist/public', { stdio: 'inherit' });
  
  console.log('Frontend build completed!');
  console.log('API functions will be handled by Vercel automatically');
}

buildForVercel().catch(console.error);
