# Vercel Deployment Guide for Rosary App

## Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database URL**: You'll need your DATABASE_URL environment variable

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for Vercel deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-rosary-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - Framework Preset: **Other**
   - Build Command: `node build-vercel.js`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 3. Set Environment Variables

In your Vercel project settings, add these environment variables:

```
DATABASE_URL=your_neon_database_url_here
NODE_ENV=production
```

To get your DATABASE_URL:
1. Go to your Neon dashboard
2. Copy the connection string
3. Add it to Vercel environment variables

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

## What's Configured

✅ **Serverless Functions**: API routes converted to Vercel functions
✅ **Static Frontend**: React app builds to static files
✅ **Database**: PostgreSQL via Neon works with Vercel
✅ **CORS**: Configured for cross-origin requests
✅ **Authentication**: Login/register system ready
✅ **Intentions**: User prayer intentions with database sync

## After Deployment

Your app will be available at: `https://your-app-name.vercel.app`

Test these features:
- **Registration**: Create a new account
- **Login**: Sign in with your credentials
- **Intentions**: Add and manage prayer intentions
- **Rosary**: Navigate through prayer sections

## Troubleshooting

### Build Fails
- Check that all dependencies are in `dependencies` (not `devDependencies`)
- Verify your DATABASE_URL is set correctly

### Database Connection Issues
- Ensure your Neon database allows connections from Vercel
- Double-check the DATABASE_URL format

### API Not Working
- Check Vercel function logs in the dashboard
- Verify API routes at `https://your-app.vercel.app/api/auth/login`

## Alternative: Quick Deploy Button

You can also create a one-click deploy button by adding this to your GitHub README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-rosary-app)
```

## Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics for usage insights
3. **Monitoring**: Set up error tracking and performance monitoring