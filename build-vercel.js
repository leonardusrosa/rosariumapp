import { execSync } from 'child_process';

async function buildForVercel() {
  console.log('Building for Vercel...');
  
  // Build frontend with Vite
  console.log('Building frontend...');
  execSync('vite build --outDir dist/public', { stdio: 'inherit' });
  
  console.log('Frontend build completed!');
  console.log('API functions will be handled by Vercel automatically');
}

buildForVercel().catch(console.error);
