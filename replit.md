# Rosarium Virginis Mariae - Sacred Digital Sanctuary

## Overview

This is a premium digital Catholic Rosary application inspired by illuminated manuscripts and sacred art. The application provides a reverent, bilingual (Latin & Portuguese) experience for praying the traditional Catholic Rosary using the Montfort method. The design emphasizes sacred typography, celestial aesthetics, and manuscript-style visual elements.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state, local React state for UI
- **Styling**: Tailwind CSS with custom sacred color palette and typography
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api` prefix
- **Data Validation**: Zod schemas for request/response validation
- **Development**: Hot module replacement with Vite integration
- **Error Handling**: Centralized error middleware with structured responses

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`

## Key Components

### Enhanced Sacred Design System
- **Typography**: Comprehensive font stack with refined weights and spacing
  - Cinzel (display headings) - enhanced with medium/semibold weights
  - Crimson Text (body text) - optimized line height and letter spacing
  - Cormorant Garamond (Latin prayers) - improved readability with loose line height
  - Playfair Display (ornate headings) - gradient text effects with enhanced shadows
  - Inter (UI elements) - medium weight for better clarity
- **Enhanced Color Palette**: Nuanced depth with improved contrast ratios
  - Cathedral backgrounds: deeper blacks (1-3%) with enhanced stone grays
  - Warmer gold tones: ancient gold variants (42-48° hue) for better warmth
  - Enhanced text hierarchy: primary, secondary, muted, and subtle text colors
  - Accessibility: high contrast mode support, WCAG AA compliant ratios
- **Sacred Spacing System**: Golden ratio-based spacing scale (4px-256px)
- **Visual Effects**: Starfield background, twinkling animations, aurora borealis effects
- **Sacred Geometry**: Golden ratio proportions, circular prayer counters inspired by rose windows
- **Accessibility Features**: Enhanced contrast, text shadow removal in high contrast mode, optimized font smoothing

### Prayer Navigation
- **Sidebar Navigation**: Illuminated manuscript-style left sidebar with ornate borders
- **Section Structure**: Initium → Gaudiosa → Dolorosa → Gloriosa → Ultima
- **Progress Tracking**: Visual prayer beads showing completion status
- **Interactive Elements**: Clickable beads for direct navigation within mysteries

### Content Management
- **Prayer Data**: Structured rosary content with Latin and Portuguese text
- **Intentions System**: User prayer intentions with local and server storage
- **Progress Persistence**: localStorage for guest users, database for authenticated users
- **Audio System**: Complete Gregorian chant player with 13 authentic sacred recordings, supporting play/pause, navigation, volume control, shuffle, repeat, and progress tracking

## Data Flow

### Authentication Flow
1. Optional user registration/login system
2. Guest users can use full functionality with localStorage
3. Authenticated users get cloud sync for progress and intentions
4. Session management with localStorage persistence

### Prayer Progress Flow
1. User navigates through rosary sections sequentially
2. Progress tracked per mystery section (Gaudiosa, Dolorosa, Gloriosa)
3. Local storage for immediate persistence
4. Server sync for authenticated users
5. Visual feedback through interactive prayer beads

### Intentions Management
1. Users can add personal prayer intentions
2. Guest mode: stored in localStorage
3. Authenticated mode: stored in database with sync
4. Modal interface for managing intentions list

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **Lucide React**: Icon library for UI elements
- **Font Awesome**: Sacred icons and symbols

### Development Tools
- **Vite**: Build tool with HMR and optimization
- **TypeScript**: Type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting (implicit)

### Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connect-pg-simple**: PostgreSQL session store (if sessions needed)

## Deployment Strategy

### Development
- Vite dev server for frontend with proxy to Express backend
- Hot module replacement for rapid development
- TypeScript compilation in watch mode
- Environment variables for database connection

### Production Build
- Frontend: Vite build to `dist/public`
- Backend: ESBuild compilation to `dist/index.js`
- Static file serving from Express in production
- Single deployment artifact with embedded frontend

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- Development/production mode detection via `NODE_ENV`
- Replit-specific development banner integration

## User Preferences

Preferred communication style: Simple, everyday language.

## Deployment Readiness

### Authentication & Security
- ✅ **Secure Authentication**: PostgreSQL-backed user system with bcrypt password hashing
- ✅ **Session Management**: Frontend localStorage with server-side verification
- ✅ **API Security**: Protected routes with proper error handling
- ✅ **Password Policies**: Strong password verification implemented

### Database & Persistence
- ✅ **PostgreSQL Database**: Fully configured with Neon serverless
- ✅ **Schema Management**: Drizzle ORM with type-safe operations
- ✅ **Data Integrity**: User intentions sync between localStorage (guest) and database (authenticated)
- ✅ **Migration System**: `npm run db:push` for schema updates

### Production Configuration
- ✅ **Environment Variables**: DATABASE_URL, NODE_ENV properly configured
- ✅ **Build System**: Vite frontend + ESBuild backend compilation
- ✅ **Storage Strategy**: Automatic PostgreSQL in production, MemStorage fallback
- ✅ **Error Handling**: Comprehensive API error responses and frontend validation

### Core Features Verified
- ✅ **User Registration**: Secure account creation with unique username validation
- ✅ **User Login**: Authenticated sessions with proper credential verification
- ✅ **Intention Storage**: Real-time sync for authenticated users, localStorage for guests
- ✅ **Prayer Progress**: Local storage with future database sync capability
- ✅ **Sacred UI**: Complete Latin interface with medieval cathedral aesthetic

## Changelog

```
Changelog:
- July 06, 2025. Vercel Deployment Fixes - resolved image import issues by moving praying hands image to public directory, simplified vercel.json configuration to remove deprecated 'builds' warnings, fixed CSS Tailwind build errors by replacing @apply directives, simplified build process to use standard npm build command, removed NODE_ENV=production requirement
- July 06, 2025. Custom Prayers Feature Complete - implemented full "Adicionar oração" functionality with enhanced UI, larger font sizes, proper spacing layout, Supabase database integration, support for both guest (localStorage) and authenticated users, custom prayers display correctly in Initium and Ultima sections
- July 06, 2025. Complete Music System Enhancement - added close button back to music bar with proper styling and pause functionality, fixed autoplay triggers for shuffle/next/previous buttons in both MiniMusicPlayer and MusicModal, enhanced song selection autoplay, achieved fully synchronized audio controls across all components
- July 06, 2025. Unified Audio System with Shared Context - implemented centralized AudioProvider to eliminate double playback conflicts between MiniMusicPlayer and MusicModal, both components now share single audio instance with synchronized state, progress tracking, and volume controls
- July 05, 2025. Fixed Audio Player Autoplay Conflicts - resolved benedictus and other slow-loading songs not autoplaying by preventing dual audio player interference between MusicModal and MiniMusicPlayer, added proper loading state checks and enhanced logging
- July 05, 2025. Fixed Supabase Connection Issues - resolved environment variable loading problems by implementing hardcoded credential fallbacks, removed guest mode entirely, confirmed full authentication functionality with working user creation, login, and intention storage
- July 05, 2025. Supabase Authentication Integration - fully connected Supabase authentication with username/email login support, implemented Supabase storage layer replacing PostgreSQL connection issues, user profiles automatically created on registration with database persistence
- July 04, 2025. Enhanced Authentication System - Added support for username/email login with user profiles table, allowing users to log in with either email or username, automatic profile creation on registration, and improved user experience
- July 04, 2025. Authentic Gregorian Chant Collection - integrated 13 real sacred audio recordings (Adoro Te Devote, Anima Christi, Benedictus, Credo, Crucem Sanctam Subiit, Gloria In Excelsis Deo, Magnificat, Media Vita, Pange Lingua, Pater Noster, Regina Caeli, Salve Regina, Veni Creator Spiritus) with full audio player system
- July 03, 2025. Custom Signum Crucis Icon Integration - added sacred Sign of the Cross SVG icon with ornate cross pattern, updated all Signum Crucis prayer instances for visual consistency
- July 03, 2025. Custom Gloria Patri Icon Integration - added sacred Trinity SVG icon featuring cross, crown, and divine elements, updated all Gloria Patri prayer instances throughout rosary sections
- July 03, 2025. Custom Ave Maria Icon Integration - added sacred Marian SVG icon featuring Our Lady's silhouette, updated all 16+ Ave Maria prayer instances throughout rosary sections
- July 03, 2025. Custom Intentions Icon Integration - added sacred intentions SVG icon with three figures representing prayer community, integrated into sidebar Intenções button and IntentionsModal header
- July 03, 2025. Custom Pater Noster Icon Integration - added sacred Our Father SVG icon with proper sizing for all "Pater Noster" prayer instances throughout rosary sections, enhancing visual consistency
- July 03, 2025. Custom Angel Icon Integration - added sacred angel SVG icon with proper sizing for "Oratio ad Angelum Custodem" and "Angelus" prayers, matching application's visual design system
- July 03, 2025. Icon Sizing Fix - corrected oversized Gloria Patri and Salve Regina icons by implementing proper SVG width/height classes instead of text-based sizing
- July 03, 2025. Sacred Animation System Enhancement - subtle cross blessings, rosary bead hover effects, gentle mystery transitions, music playback pulsing, enhanced interactive hover states
- July 03, 2025. Comprehensive Design System Enhancement - refined typography, enhanced color palette, improved accessibility, better spacing system
- July 03, 2025. Enhanced Sacred Typography Stack implemented - improved font weights, line heights, letter spacing, and added Playfair Display for ornate headings
- July 03, 2025. Authentication and database persistence implemented - DEPLOYMENT READY
- July 02, 2025. Initial setup
```
