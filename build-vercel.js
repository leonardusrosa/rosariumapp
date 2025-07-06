import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

async function buildForVercel() {
  console.log('Building for Vercel...');
  
  // Ensure output directory exists
  const outputDir = 'dist/public';
  mkdirSync(outputDir, { recursive: true });
  
  // Build using the standard npm build command
  console.log('Building application...');
  try {
    // Use the standard build command which should handle everything properly
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
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
