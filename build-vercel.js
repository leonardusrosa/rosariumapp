import { build } from 'esbuild';
import { execSync } from 'child_process';

async function buildForVercel() {
  console.log('Building for Vercel...');
  
  // Build frontend with Vite
  console.log('Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Build backend components
  console.log('Building backend components...');
  
  // Build storage
  await build({
    entryPoints: ['server/storage.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist/server',
    packages: 'external',
    target: 'node20'
  });
  
  // Build schema
  await build({
    entryPoints: ['shared/schema.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist/shared',
    packages: 'external',
    target: 'node20'
  });
  
  console.log('Vercel build completed!');
}

buildForVercel().catch(console.error);