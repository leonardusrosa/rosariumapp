import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FontSizeProvider } from "@/hooks/useFontSize";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import RosaryPage from "@/pages/rosary";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={RosaryPage} />
      <Route component={NotFound} />
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
              <div className="min-h-screen starfield-bg">
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
