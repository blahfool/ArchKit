import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { useEffect } from "react";
import { syncFromServer } from "./lib/offlineStorage";
import { Logo } from "@/components/Logo";

// Pages
import Home from "@/pages/Home";
import Calculator from "@/pages/Calculator";
import TermsIndex from "@/pages/TermsIndex";
import ArMeasure from "@/pages/ArMeasure";
import Assessment from "@/pages/Assessment";
import Progress from "@/pages/Progress";
import EBook from "@/pages/EBook";
import Portfolio from "@/pages/Portfolio";
import BuildingCodes from "@/pages/BuildingCodes";
import ProfessionalTools from "@/pages/ProfessionalTools";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import AI from "@/pages/AI"; // Added import

// Components
import ThemeToggle from "@/components/ThemeToggle";
import OfflineIndicator from "@/components/OfflineIndicator";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Initial sync when app loads and is online
    if (navigator.onLine) {
      syncFromServer();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Only show logo on home screen */}
      {location === "/" && (
        <div className="fixed top-4 left-4 z-50">
          <Logo size={40} />
        </div>
      )}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/terms" component={TermsIndex} />
        <Route path="/ar" component={ArMeasure} />
        <Route path="/exam" component={Assessment} />
        <Route path="/progress" component={Progress} />
        <Route path="/ebook" component={EBook} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/codes" component={BuildingCodes} />
        <Route path="/professional" component={ProfessionalTools} />
        <Route path="/about" component={About} />
        <Route path="/ai" component={AI} /> {/* Added route */}
        <Route component={NotFound} />
      </Switch>
      <OfflineIndicator />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}