import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FontSizeProvider } from "@/hooks/useFontSize";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { BibliothecaProvider } from "@/contexts/BibliothecaContext";

// Bibliotheca Pages
import LibraryPage from "@/pages/bibliotheca/LibraryPage";
import LectioPage from "@/pages/bibliotheca/LectioPage";
import ProximaPage from "@/pages/bibliotheca/ProximaPage";
import LectaPage from "@/pages/bibliotheca/LectaPage";
import DesiderataPage from "@/pages/bibliotheca/DesiderataPage";
import BookDetailPage from "@/pages/bibliotheca/BookDetailPage";
import PlaceholderPage from "@/pages/bibliotheca/PlaceholderPage";
import DetailPlaceholderPage from "@/pages/bibliotheca/DetailPlaceholderPage";

// Preserved Rosarium Page
import RosaryPage from "@/pages/rosary";
import NotFound from "@/pages/not-found";

function RedirectToLibrary() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/library", { replace: true });
  }, [setLocation]);
  return null;
}

// Scoped exclusively to Bibliotheca routes (Rosarium never mounts this provider)
function BibliothecaRoutes() {
  return (
    <BibliothecaProvider>
      <Switch>
        <Route path="/library" component={LibraryPage} />
        <Route path="/reading" component={LectioPage} />
        <Route path="/next" component={ProximaPage} />
        <Route path="/read" component={LectaPage} />
        <Route path="/wishlist" component={DesiderataPage} />
        <Route path="/collections">{() => <PlaceholderPage sectionKey="collections" />}</Route>
        <Route path="/notes">{() => <PlaceholderPage sectionKey="notes" />}</Route>
        <Route path="/ai">{() => <PlaceholderPage sectionKey="ai" />}</Route>

        <Route path="/book/:workId" component={BookDetailPage} />
        <Route path="/author/:id">{() => <DetailPlaceholderPage type="author" />}</Route>
        <Route path="/collection/:id">{() => <DetailPlaceholderPage type="collection" />}</Route>

        {/* Fallback inside Bibliotheca scope */}
        <Route component={NotFound} />
      </Switch>
    </BibliothecaProvider>
  );
}

function Router() {
  return (
    <Switch>
      {/* Root redirect to Bibliotheca */}
      <Route path="/" component={RedirectToLibrary} />

      {/* Preserved Rosarium Application - without BibliothecaProvider */}
      <Route path="/rosary" component={RosaryPage} />

      {/* Bibliotheca Application Routes */}
      <Route component={BibliothecaRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <FontSizeProvider>
            <TooltipProvider>
              <div className="min-h-screen">
                <Toaster />
                <Router />
              </div>
            </TooltipProvider>
          </FontSizeProvider>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
