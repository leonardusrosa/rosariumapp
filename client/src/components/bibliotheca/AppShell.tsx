import React, { ReactNode } from "react";
import { LibrarySidebar } from "./LibrarySidebar";
import { MobileNavigation } from "./MobileNavigation";
import { MidnightBackground } from "./MidnightBackground";
import { ImportLibraryModal } from "./ImportLibraryModal";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen text-[var(--parchment)] relative selection:bg-[var(--ancient-gold-warm)] selection:text-[var(--cathedral-void)]">
      {/* Immersive Midnight Background */}
      <MidnightBackground />

      {/* Desktop Fixed Left Sidebar */}
      <LibrarySidebar />

      {/* Main Viewport Content Area */}
      <div className="md:ml-64 lg:ml-72 min-h-screen flex flex-col">
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 pb-24 md:pb-12 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Responsive Bottom Navigation */}
      <MobileNavigation />

      {/* Cloud Library Import Modal */}
      <ImportLibraryModal />
    </div>
  );
}

export default AppShell;
